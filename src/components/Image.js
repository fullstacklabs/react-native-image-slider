// @flow
import React, {Component} from 'react';
import {Image} from 'react-native';

export default class _Image extends Component {
  render() {
    // let started: boolean = false;
    // let ended: boolean = false;
    // let done: boolean = false;

    function isStarting() {
      // started = true;
    }
    function isEnding() {
      // ended = done;
    }
    function isDone() {
      // done = true;
    }
    return (
      <Image
        {...this.props}
        onLoadStart={isStarting}
        onLoadEnd={isEnding}
        onLoad={isDone}
        />
    );
  }
}
