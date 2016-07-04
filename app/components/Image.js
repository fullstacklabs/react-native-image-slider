// @flow
import React from 'react';
import {Image} from 'react-native';

export default (props: Object) => {
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
      {...props}
      onLoadStart={isStarting}
      onLoadEnd={isEnding}
      onLoad={isDone}
      />
  );
};
