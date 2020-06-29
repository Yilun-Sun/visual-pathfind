import React, { Component } from 'react';
import PathfindStyle from './PathfindStyle';
import paper, { Tool, Shape, Group, Point, PointText } from 'paper';
import StyledComponent from './core/StyledComponent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { dijkstra } from '../../../algorithms/dijkstra';

export default class PathFind extends Component {
  constructor() {
    super();
    this.state = { nodeSize: 40, isRenderingAlgo: false, showTips: false };

    // **** global variables ****
    this.brush = {
      type: 'wall',
      color: 'black',
      brushDict: { empty: 'white', wall: 'black', start: '#20e82a', finish: 'red' },
      setType: function (typeName) {
        this.type = typeName;
        this.color = this.brushDict[typeName];
        console.log(this.color);
      },
    };

    // for nodes type in grid:
    // empty    : 'empty'
    // wall     : 'wall'
    // start    : 'start'
    // finish   : 'finish'
    // // visited  : 'visited'
    // // path     : 'path'
    this.grid = [];
    this.gridRows = 20;
    this.gridCols = 40;
    this.backgroundColor = 'white';
    this.visitedNodeColor = '#3A8FB7';
    this.shortestPathColor = '#d6ff75';
    this.gridLineColor = '#777777';
    this.gridLineWidth = 1;

    this.canvasNodeGroup = undefined;
    this.onMouseDownNodeType = '';
    this.mouseDownOnce = false;
    this.onEraseMode = false;

    this.specialNodesProps = {
      startRow: -1,
      startCol: -1,
      finishRow: -1,
      finishCol: -1,
      hasStart: false,
      hasFinish: false,
      onDragSpecial: false,
    };
  }

  componentDidMount() {
    // setup paper
    paper.setup(this.canvas);
    paper.tools.forEach((tool) => tool.remove());
    const tool = new Tool();
    tool.onMouseDrag = (event) => {
      this.onMouseDrag(event);
    };
    tool.onMouseDown = (event) => {
      this.onMouseDown(event);
    };
    paper.view.onResize = () => {
      this.initCanvas();
    };

    this.initCanvas();
  }

  initCanvas = () => {
    console.log('initing canvas');
    paper.setup(this.canvas);

    // TODO: should save previous state, copy from it
    this.grid = this.getInitialGrid();
    this.createInitialCanvasNodes();

    this.trySetUpInitStartAndFinish();
    this.tryInitStartAndFinish();
  };

  createInitialCanvasNodes = () => {
    const nodeSize = this.state.nodeSize;
    const gridLineWidth = this.gridLineWidth;
    const rows = Math.ceil(this.canvas.height / nodeSize);
    const cols = Math.ceil(this.canvas.width / nodeSize);
    var canvasNodeGroup = new Group();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const path = new Shape.Rectangle({
          fillColor: 'white',
          center: [col * nodeSize + nodeSize / 2, row * nodeSize + nodeSize / 2],
          size: nodeSize - gridLineWidth,
          name: `${row}-${col}`,
        });
        canvasNodeGroup.addChild(path);

        if (row === 0 || col === 0) {
          const text = new PointText(new Point(col * nodeSize + nodeSize / 2, row * nodeSize + nodeSize / 2));
          text.justification = 'center';
          text.fillColor = 'grey';
          text.content = row === 0 ? col : row;
          canvasNodeGroup.addChild(text);
        }
      }
    }

    this.canvasNodeGroup = canvasNodeGroup;
  };

  getInitialGrid = () => {
    const nodeSize = this.state.nodeSize;
    const rows = Math.ceil(this.canvas.height / nodeSize);
    const cols = Math.ceil(this.canvas.width / nodeSize);

    const grid = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push('empty');
      }
      grid.push(currentRow);
    }
    return grid;
  };

  onMouseDown = (event) => {
    const currentX = event.point.x;
    const currentY = event.point.y;
    const nodeSize = this.state.nodeSize;
    const currentRow = Math.floor(currentY / nodeSize);
    const currentCol = Math.floor(currentX / nodeSize);

    if (this.grid[currentRow][currentCol] === 'start' || this.grid[currentRow][currentCol] === 'finish') {
      this.onMouseDownNodeType = this.grid[currentRow][currentCol];
      this.specialNodesProps.onDragSpecial = true;
    } else {
      this.onMouseDownNodeType = '';
      this.specialNodesProps.onDragSpecial = false;
    }
    if (this.isCoorsChange(currentRow, currentCol)) {
      this.mouseDownOnce = true;
    }

    if (this.brush.type === 'wall' && this.grid[currentRow][currentCol] === 'wall') {
      this.onEraseMode = true;
    } else {
      this.onEraseMode = false;
    }

    this.onMouseDrag(event);
  };

  onMouseDrag = (event) => {
    const currentX = event.point.x;
    const currentY = event.point.y;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const nodeSize = this.state.nodeSize;
    const currentRow = Math.floor(currentY / nodeSize);
    const currentCol = Math.floor(currentX / nodeSize);
    const brush = this.brush;
    var canDraw = true;

    if (currentX > canvasWidth || currentX < 0 || currentY > canvasHeight || currentY < 0) {
      return;
    }

    // if pointed node is undefined, return
    if (!this.grid[currentRow][currentCol]) return;

    if (this.grid[currentRow][currentCol] === 'start' || this.grid[currentRow][currentCol] === 'finish') return;

    // if (this.grid[currentRow][currentCol] === brush.type)

    const specialNodesProps = this.specialNodesProps;
    switch (brush.type) {
      case 'start':
        if (!specialNodesProps.hasStart) {
          specialNodesProps.hasStart = true;
          specialNodesProps.startRow = currentRow;
          specialNodesProps.startCol = currentCol;
        } else canDraw = false;
        break;
      case 'finish':
        if (!specialNodesProps.hasFinish) {
          specialNodesProps.hasFinish = true;
          specialNodesProps.finishRow = currentRow;
          specialNodesProps.finishCol = currentCol;
        } else canDraw = false;
        break;

      default:
        break;
    }

    if (this.onMouseDownNodeType === 'start' || this.onMouseDownNodeType === 'finish') {
      specialNodesProps.onDragSpecial = true;
    }

    // TODO
    // if (this.onMouseDownNodeType === brush.type) {
    //   if (this.onMouseDownNodeType === 'empty') brush.setType('wall');
    //   else if (this.onMouseDownNodeType === 'wall') brush.setType('empty');
    // }

    if (this.specialNodesProps.onDragSpecial) {
      canDraw = false;

      if (this.onMouseDownNodeType === 'start') {
        const lastNode = this.canvasNodeGroup.children[`${specialNodesProps.startRow}-${specialNodesProps.startCol}`];
        lastNode.fillColor = brush.brushDict['empty'];
        if (specialNodesProps.startRow !== currentRow || specialNodesProps.startCol !== currentCol) {
          this.grid[specialNodesProps.startRow][specialNodesProps.startCol] = 'empty';
          this.grid[currentRow][currentCol] = 'start';

          specialNodesProps.startRow = currentRow;
          specialNodesProps.startCol = currentCol;
          // print Dijkstra
          if (this.state.isRenderingAlgo) this.printDijkstra();
        }
      } else if (this.onMouseDownNodeType === 'finish') {
        const lastNode = this.canvasNodeGroup.children[`${specialNodesProps.finishRow}-${specialNodesProps.finishCol}`];
        lastNode.fillColor = brush.brushDict['empty'];
        if (specialNodesProps.finishRow !== currentRow || specialNodesProps.finishCol !== currentCol) {
          this.grid[specialNodesProps.finishRow][specialNodesProps.finishCol] = 'empty';
          this.grid[currentRow][currentCol] = 'finish';

          specialNodesProps.finishRow = currentRow;
          specialNodesProps.finishCol = currentCol;
          // print Dijkstra
          if (this.state.isRenderingAlgo) this.printDijkstra();
        }
      }

      const path = this.canvasNodeGroup.children[`${currentRow}-${currentCol}`];
      path.fillColor = brush.brushDict[this.onMouseDownNodeType];
    }

    // TODO:
    if (canDraw) {
      if (brush.type !== 'start' && this.grid[currentRow][currentCol] === 'start') {
        specialNodesProps.startRow = -1;
        specialNodesProps.startCol = -1;
        specialNodesProps.hasStart = false;
      } else if (brush.type !== 'finish' && this.grid[currentRow][currentCol] === 'finish') {
        specialNodesProps.finishRow = -1;
        specialNodesProps.finishCol = -1;
        specialNodesProps.hasFinish = false;
      }

      // on Erase Mode
      if (this.onEraseMode) {
        this.grid[currentRow][currentCol] = 'empty';
        const path = this.canvasNodeGroup.children[`${currentRow}-${currentCol}`];
        path.fillColor = brush.brushDict['empty'];
        this.animateNode(path);
      } else {
        this.grid[currentRow][currentCol] = brush.type;
        const path = this.canvasNodeGroup.children[`${currentRow}-${currentCol}`];
        path.fillColor = brush.color;
        this.animateNode(path);
      }
    }

    if (this.isCoorsChange(currentRow, currentCol) || this.mouseDownOnce) {
      this.mouseDownOnce = false;
      if (this.state.isRenderingAlgo) this.printDijkstra();
    }
  };

  trySetUpInitStartAndFinish = () => {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    if (canvasWidth > 400 && canvasHeight > 400) {
      const coors = this.getNodeIndexAtPosition(canvasWidth, canvasHeight);
      this.specialNodesProps = {
        startRow: Math.floor(coors[0] / 2),
        startCol: Math.floor(coors[1] / 3),
        finishRow: Math.floor(coors[0] / 2),
        finishCol: Math.floor((2 * coors[1]) / 3),
        hasStart: true,
        hasFinish: true,
      };
      this.grid[this.specialNodesProps.startRow][this.specialNodesProps.startCol] = 'start';
      this.grid[this.specialNodesProps.finishRow][this.specialNodesProps.finishCol] = 'finish';
    } else {
      this.specialNodesProps = {
        startRow: -1,
        startCol: -1,
        finishRow: -1,
        finishCol: -1,
        hasStart: false,
        hasFinish: false,
        lastRow: -1,
        lastCol: -1,
      };
    }
  };

  getNodeIndexAtPosition = (posX, posY) => {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const nodeSize = this.state.nodeSize;

    const row = Math.floor(canvasHeight / nodeSize);
    const col = Math.floor(canvasWidth / nodeSize);
    return [row, col];
  };

  tryInitStartAndFinish = () => {
    const hasStart = this.specialNodesProps.hasStart;
    const hasFinish = this.specialNodesProps.hasFinish;
    const startRow = this.specialNodesProps.startRow;
    const startCol = this.specialNodesProps.startCol;
    const finishRow = this.specialNodesProps.finishRow;
    const finishCol = this.specialNodesProps.finishCol;

    if (hasStart) {
      const path = this.canvasNodeGroup.children[`${startRow}-${startCol}`];
      path.fillColor = this.brush.brushDict['start'];
      this.grid[startRow][startCol] = 'start';
    }
    if (hasFinish) {
      const path = this.canvasNodeGroup.children[`${finishRow}-${finishCol}`];
      path.fillColor = this.brush.brushDict['finish'];
      this.grid[finishRow][finishCol] = 'finish';
    }
  };

  isCoorsChange = (currentRow, currentCol) => {
    const specialNodesProps = this.specialNodesProps;
    if (specialNodesProps.lastRow !== currentRow || specialNodesProps.lastCol !== currentCol) {
      specialNodesProps.lastRow = currentRow;
      specialNodesProps.lastCol = currentCol;
      return true;
    }
    return false;
  };

  animateNode = (path) => {
    const colorBefore = path.fillColor;
    path.fillColor = 'yellow';
    const tween = path.tween(
      {
        size: this.state.nodeSize + 5,
        fillColor: '#fffc4f',
      },
      {
        easing: 'easeInOutCubic',
        duration: 200,
      }
    );
    tween.then(() => {
      // ...tween color back to color before.
      path.tweenTo(
        {
          size: this.state.nodeSize - this.gridLineWidth,
          fillColor: colorBefore,
        },
        300
      );
    });
  };

  test1() {
    console.log('test1:');
    console.log(this.state.isRenderingAlgo);
    console.log(this.specialNodesProps);
  }

  test2() {
    console.log('test2:');
  }

  initCanvasGridSize = () => {
    const nodeSize = this.state.nodeSize;
    const gridLineWidth = this.gridLineWidth;
    const rows = Math.ceil(this.canvas.height / nodeSize);
    const cols = Math.ceil(this.canvas.width / nodeSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.canvasNodeGroup.children[`${row}-${col}`]) {
          const path = this.canvasNodeGroup.children[`${row}-${col}`];
          path.size = nodeSize - gridLineWidth;
        }
      }
    }
  };

  setBrush = (brushType) => {
    if (['empty', 'wall', 'start', 'finish'].includes(brushType)) {
      this.brush.setType(brushType);
    }
  };

  printDijkstra = () => {
    const temp = this.specialNodesProps;
    if (!temp.hasStart || !temp.hasFinish) {
      console.log('missing start or finish node');
      return;
    }

    const resultArray = dijkstra(this.grid, temp.startRow, temp.startCol, temp.finishRow, temp.finishCol);
    const visitedNodesInOrder = resultArray[0];
    const nodesInShortestPathOrder = resultArray[1];

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        const path = this.canvasNodeGroup.children[`${row}-${col}`];
        path.fillColor = this.brush.brushDict[this.grid[row][col]];
      }
    }

    if (visitedNodesInOrder !== null) {
      visitedNodesInOrder.forEach((node) => {
        const path = this.canvasNodeGroup.children[`${node.row}-${node.col}`];
        if (
          (node.row !== temp.startRow || node.col !== temp.startCol) &&
          (node.row !== temp.finishRow || node.col !== temp.finishCol)
        )
          path.fillColor = this.visitedNodeColor;
      });
    } else {
      console.log('visitedNodesInOrder is null');
    }

    if (nodesInShortestPathOrder !== null) {
      nodesInShortestPathOrder.forEach((node) => {
        const path = this.canvasNodeGroup.children[`${node.row}-${node.col}`];
        if (
          (node.row !== temp.startRow || node.col !== temp.startCol) &&
          (node.row !== temp.finishRow || node.col !== temp.finishCol)
        ) {
          path.fillColor = this.shortestPathColor;
        }
      });
    } else {
      console.log('nodesInShortestPathOrder is null');
    }
  };

  switchRenderingAlgo = () => {
    const lastRenderingState = this.state.isRenderingAlgo;
    this.setState({ isRenderingAlgo: !lastRenderingState });
    if (!lastRenderingState) {
      this.printDijkstra();
    } else {
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[0].length; col++) {
          const path = this.canvasNodeGroup.children[`${row}-${col}`];
          path.fillColor = this.brush.brushDict[this.grid[row][col]];
        }
      }
    }
  };

  switchGridLineVisibility = () => {
    if (this.gridLineWidth === 0) this.gridLineWidth = 1;
    else if (this.gridLineWidth === 1) this.gridLineWidth = 0;
    else this.gridLineWidth = 1;
    this.initCanvasGridSize();
  };

  handleClose = () => {
    this.setState({ showTips: false });
  };

  handleClickOpen = () => {
    this.setState({ showTips: true });
  };

  render() {
    return (
      <StyledComponent styleMap={PathfindStyle}>
        {(useStyles) => {
          const styles = useStyles(this.props);
          return (
            <div className={styles.main}>
              <div className={styles.top_navigation_bar} id="top_navigation_bar">
                <AppBar position="static">
                  <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={styles.title}>
                      Interactive Visualized Pathfinder
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                  </Toolbar>
                </AppBar>
              </div>
              <div className={styles.left_tool_box}>
                <List component="nav" aria-label="secondary mailbox folders">
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.isRenderingAlgo}
                          onChange={this.switchRenderingAlgo}
                          name="switchRenderingAlgo"
                          color="primary"
                        />
                      }
                      label="Auto-Render"
                    />
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.switchGridLineVisibility()}>
                      Grid
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.setBrush('start')}>
                      start
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.setBrush('finish')}>
                      finish
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.setBrush('wall')}>
                      wall
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.initCanvas()}>
                      reset
                    </Button>
                  </ListItem>
                  <Divider />
                  {/* <ListItem>
                    <ExpansionPanel>
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={styles.title}>Algorithms</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <div>
                          <Button variant="outlined">HAHA</Button>
                          <Button variant="outlined">HAHA</Button>
                          <Button variant="outlined">HAHA</Button>
                        </div>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </ListItem> */}
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.test1()}>
                      Props
                    </Button>
                  </ListItem>
                  <ListItem>
                    <div>
                      <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                        Show Guides
                      </Button>
                      <Dialog
                        open={this.state.showTips}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-slide-description">
                            Let Google help apps determine location. This means sending anonymous location data to
                            Google, even when no apps are running.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={this.handleClose} color="primary">
                            Disagree
                          </Button>
                          <Button onClick={this.handleClose} color="primary">
                            Agree
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.test2()}>
                      TEST2
                    </Button>
                  </ListItem>
                </List>
              </div>
              <div className={styles.main_canvas}>
                <canvas
                  resize="true"
                  style={{ width: '100%', height: '100%', backgroundColor: this.gridLineColor }}
                  ref={(el) => {
                    this.canvas = el;
                  }}
                />
              </div>
            </div>
          );
        }}
      </StyledComponent>
    );
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
