import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
  render() {
    const { row, col } = this.props;
    // var pathScoreContainer = this.scores(gScore, hScore, fScore, distance);
    return (
      <div id={`node-${row}-${col}`} className={`node-test`}>
        <div className="path"></div>
      </div>
    );
  }
}
