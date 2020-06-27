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

import { dijkstra } from '../../../algorithms/dijkstra';

export default class PathFind extends Component {
  constructor() {
    super();
    this.state = { nodeSize: 40 };

    // **** global variables ****
    this.brush = {
      type: 'wall',
      color: 'black',
      brushDict: { empty: 'white', wall: 'black', start: 'green', finish: 'red' },
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
    // visited  : 'visited'
    // path     : 'path'
    this.grid = [];
    this.gridRows = 20;
    this.gridCols = 40;
    this.backgroundColor = 'white';
    this.gridLineColor = '#777777';
    this.gridLineWidth = 1;

    this.canvasNodeGroup = undefined;
    this.needInitCanvas = true;
    this.onMouseDownNodeType = '';
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
      this.resetCanvas();
    };

    if (this.needInitCanvas) {
      this.grid = this.getInitialNodes();
      this.getInitialCanvasNodes();
      this.needInitCanvas = false;
      console.log('init');
    }
  }

  resetCanvas = () => {
    console.log('resized, resetting canvas');
    paper.setup(this.canvas);
    // TODO: don't know if this block is nessesary
    /* 
      paper.tools.forEach((tool) => tool.remove());
      const tool = new Tool();
      tool.onMouseDrag = (event) => {
        this.onMouseDrag(event);
      };
    */
    // TODO: should save previous state, copy from it
    this.grid = this.getInitialNodes();
    this.getInitialCanvasNodes();
    this.needInitCanvas = false;

    this.specialNodesProps = {
      startRow: -1,
      startCol: -1,
      finishRow: -1,
      finishCol: -1,
      hasStart: false,
      hasFinish: false,
    };
  };

  onMouseDown = (event) => {
    const currentX = event.point.x;
    const currentY = event.point.y;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const nodeSize = this.state.nodeSize;
    const currentRow = Math.floor(currentY / nodeSize);
    const currentCol = Math.floor(currentX / nodeSize);

    // TODO:
    if (this.grid[currentRow][currentCol] === 'start' || this.grid[currentRow][currentCol] === 'finish') {
      this.onMouseDownNodeType = this.grid[currentRow][currentCol];
      this.specialNodesProps.onDragSpecial = true;
    } else {
      this.onMouseDownNodeType = '';
      this.specialNodesProps.onDragSpecial = false;
    }
    console.log(this.onMouseDownNodeType + ' ' + this.specialNodesProps.onDragSpecial);

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

    if (this.grid[currentRow][currentCol] === brush.type) return;

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
    console.log(this.onMouseDownNodeType + ' ' + this.specialNodesProps.onDragSpecial);

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

      this.grid[currentRow][currentCol] = brush.type;

      //   const gridLineWidth = this.gridLineWidth;
      const path = this.canvasNodeGroup.children[`${currentRow}-${currentCol}`];
      path.fillColor = brush.color;

      // TODO: enable animation
      // const tween = path.tween(
      //   {
      //     size: nodeSize + 5,
      //     fillColor: 'yellow',
      //   },
      //   {
      //     easing: 'easeInOutCubic',
      //     duration: 200,
      //   }
      // );
      // tween.then(() => {
      //   // ...tween color back to blue.
      //   path.tweenTo(
      //     {
      //       size: nodeSize - gridLineWidth,
      //       fillColor: brush.color,
      //     },
      //     300
      //   );
      // });

      // const text = new PointText(
      //   new Point(
      //     Math.floor(currentX / nodeSize) * nodeSize + nodeSize / 2,
      //     Math.floor(currentY / nodeSize) * nodeSize + nodeSize / 2
      //   )
      // );
      // text.justification = 'center';
      // text.fillColor = 'black';
      // text.content = 'wall';
    }
  };

  handleMouseUp() {
    console.log('up');
    // this.setState({ mouseIsPressed: false });
  }

  test1() {
    console.log('test1:');
    console.log(this.specialNodesProps);
  }

  test2() {
    console.log('test2:');
    this.gridLineWidth = 0;
    this.resetCanvasGridSize();
  }

  getInitialNodes = () => {
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

  getInitialCanvasNodes = () => {
    var canvasNodeGroup = new Group();

    const nodeSize = this.state.nodeSize;
    const gridLineWidth = this.gridLineWidth;
    const rows = Math.ceil(this.canvas.height / nodeSize);
    const cols = Math.ceil(this.canvas.width / nodeSize);

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

  resetCanvasGridSize = () => {
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
    console.log('printDijkstra');
    // TODO:
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
          path.fillColor = '#3A8FB7';
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
        )
          path.fillColor = '#86C166';
      });
    } else {
      console.log('nodesInShortestPathOrder is null');
    }
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
                    <Typography variant="h6" className={styles.title}>
                      Interactive Visualized Pathfinder
                    </Typography>
                    {/* <Button color="inherit">Login</Button> */}
                  </Toolbar>
                </AppBar>
              </div>
              <div className={styles.left_tool_box}>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItem
                    button
                    onClick={() =>
                      (this.brushColor = this.brushColor === this.gridLineColor ? 'blue' : this.gridLineColor)
                    }
                  >
                    <ListItemText primary="changeColor" />
                  </ListItem>
                  <ListItem button onClick={() => console.log(this.grid)}>
                    <ListItemText primary="show nodes" />
                  </ListItem>
                  <ListItem button>
                    <ListItemText primary="do something" />
                  </ListItem>
                </List>
                <Divider />
                <List component="nav" aria-label="secondary mailbox folders">
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.test1()}>
                      Props
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.printDijkstra()}>
                      Dijk
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.test2()}>
                      TEST2
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
                    <Button variant="outlined" onClick={() => this.setBrush('empty')}>
                      empty
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button variant="outlined" onClick={() => this.resetCanvas()}>
                      reset
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
