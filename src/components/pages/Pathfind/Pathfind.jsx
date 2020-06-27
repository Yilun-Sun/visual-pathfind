import React, { Component } from 'react';
import PathfindStyle from './PathfindStyle';
import paper, { Tool, Shape, Path, Point, PointText } from 'paper';
import StyledComponent from './core/StyledComponent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathFind extends Component {
  constructor() {
    super();
    this.state = { nodeSize: 30 };
    // Don't call this.setState() here!
    this.color = 'blue';
    this.grid = [];
    this.gridRows = 20;
    this.gridCols = 40;
    this.backgroundColor = 'white';
    this.gridLineColor = 'grey';

    this.needInitCanvas = true;
  }

  componentDidMount() {
    this.grid = getInitialNodes();

    paper.setup(this.canvas);
    paper.tools.forEach((tool) => tool.remove());
    const tool = new Tool();
    tool.onMouseDrag = (event) => {
      this.onMouseDrag(event);
    };

    // if (this.needInitCanvas) {
    //   this.drawBackGround();
    //   this.drawLineGrid();
    //   this.needInitCanvas = false;
    //   console.log('init');
    // }
  }

  drawBackGround = () => {
    const path = new Shape.Rectangle({
      fillColor: this.gridLineColor,
      point: [0, 0],
      size: [paper.view.size.width, paper.view.size.height],
    });
  };
  drawLineGrid = () => {
    const nodeSize = this.state.nodeSize;
    for (let i = 0; i < paper.view.size.height; i += nodeSize) {
      for (let j = 0; j < paper.view.size.width; j += nodeSize) {
        const path = new Shape.Rectangle({
          fillColor: this.backgroundColor,
          point: [j + 1, i + 1],
          size: nodeSize - 2,
        });
      }
    }
  };

  onMouseDrag = (event) => {
    const currentX = event.point.x;
    const currentY = event.point.y;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const nodeSize = this.state.nodeSize;
    const currentRow = Math.floor(currentY / nodeSize);
    const currentCol = Math.floor(currentX / nodeSize);

    if (currentX > canvasWidth || currentX < 0 || currentY > canvasHeight || currentY < 0) {
      return;
    }

    // if pointed node already is a wall, return
    if (this.grid[currentRow][currentCol] === 1) return;

    this.grid[currentRow][currentCol] = 1;
    // TODO:
    const path = new Shape.Rectangle({
      fillColor: this.color,
      center: [
        Math.floor(currentX / nodeSize) * nodeSize + nodeSize / 2,
        Math.floor(currentY / nodeSize) * nodeSize + nodeSize / 2,
      ],
      size: nodeSize - 2,
    });
    const tween = path.tween(
      {
        size: nodeSize + 5,
        fillColor: 'yellow',
      },
      {
        easing: 'easeInOutCubic',
        duration: 200,
      }
    );
    tween.then(() => {
      // ...tween color back to blue.
      path.tweenTo(
        {
          size: nodeSize - 2,
          fillColor: this.color,
        },
        300
      );
    });

    // const text = new PointText(
    //   new Point(
    //     Math.floor(currentX / nodeSize) * nodeSize + nodeSize / 2,
    //     Math.floor(currentY / nodeSize) * nodeSize + nodeSize / 2
    //   )
    // );
    // text.justification = 'center';
    // text.fillColor = 'black';
    // text.content = 'wall';
  };

  handleMouseUp() {
    console.log('up');
    // this.setState({ mouseIsPressed: false });
  }

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
                    onClick={() => (this.color = this.color === this.gridLineColor ? 'blue' : this.gridLineColor)}
                  >
                    <ListItemText primary="button" />
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
                    <Button variant="outlined">Default</Button>
                  </ListItem>
                </List>
                {/* left tool box
                <button onClick={() => (this.color = this.color === this.gridLineColor ? 'blue' : this.gridLineColor)}>
                  button
                </button>
                <button onClick={() => console.log(this.grid)}>show nodes</button>
                <button onClick={() => console.log(this.setState({ nodeSize: 50 }))}>set node size to 50</button> */}
              </div>
              <div className={styles.main_canvas}>
                <canvas
                  resize="true"
                  style={{ width: '100%', height: '100%', backgroundColor: '#d8e0f0' }}
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

const getInitialNodes = () => {
  const grid = [];
  for (let row = 0; row < 100; row++) {
    const currentRow = [];
    for (let col = 0; col < 100; col++) {
      currentRow.push(0);
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
