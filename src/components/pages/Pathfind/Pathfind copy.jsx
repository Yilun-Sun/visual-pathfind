import React, { Component } from 'react';
import PathfindStyle from './PathfindStyle';
import Node from './core/Node';

const PathFind = () => {
  const count = 10;
  const style = PathfindStyle.useStyles();
  const sellSize = 20;

  const getCells = () => {
    const style = PathfindStyle.useStyles();
    var list = [];
    for (let row = 0; row < 40; row++) {
      //   var temp = [];
      for (let col = 0; col < 60; col++) {
        var topDist = row * (sellSize + 1) + 'px';
        var leftDist = col * (sellSize + 1) + 'px';
        list.push(
          <div
            id={row + '-' + col}
            className={style.canvas_cell}
            style={{ top: topDist, left: leftDist }}
            key={row + '-' + col}
            onMouseMove={() => {
              changeCell(row + '-' + col);
            }}
          ></div>
        );
      }
      //   list.push(temp);
    }
    return list;
  };

  const nodes = getCells();

  const onMouseMoving = (event) => {
    event.preventDefault();
    // console.log('moving');
  };

  const changeCell = (arg) => {
    const element = document.getElementById(arg);
    if (element) {
      element.className = style.canvas_cell_created;
    }
  };

  return (
    <div className={style.main}>
      <div className={style.top_navigation_bar} id="top_navigation_bar">
        top nav bar
      </div>
      <div className={style.left_tool_box} onClick={() => {}}>
        left tool box, You clicked {count} times
      </div>
      <div className={style.main_canvas} onMouseMove={onMouseMoving}>
        {nodes}
      </div>
    </div>
  );
};

export default PathFind;
