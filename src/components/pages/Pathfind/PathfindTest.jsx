import React, { Component } from 'react';
import PathfindStyle from './PathfindStyle';
// import paper from '../../lib/paper-core';
// import 'paper' from 'paper';

export default class PathFind extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    // paperjs
    // paper.setup(this.canvas);
  }

  render() {
    return (
      <>
        <canvas
          resize="true"
          style={{ width: '100%', height: '100%' }}
          ref={(el) => {
            this.canvas = el;
          }}
        />
        <button>1</button>
      </>
    );
  }
}
