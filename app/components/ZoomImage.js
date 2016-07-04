// @flow
import React, {Component} from 'react';
import {PanResponder} from 'react-native';
import scale from '../lib/scale';
import Image from './Image';

type PROPS = {
  width: number,
  height: number,
  source: number|{uri: string},
  [field: string]: any,
  style: any,
};

type STATE = {
  zoom: number,
  width: number,
  height: number,
};

export default class ZoomImage extends Component {
  props: PROPS;
  state: STATE = {
    zoom: 1,
    ...scale(this.props.width, this.props.height),
  };
  animate = false;
  zoomer() {
    if (this.animate) {
      console.log('zoomer');
      this.setState(
        {zoom: this.state.zoom + 0.01},
        () => setTimeout(() => this.zoomer(), 100),
      );
    }
  }
  makeHandlers(): Object {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderRelease: this.onRelease,
      onPanResponderMove: this.onMove,
    }).panHandlers;
  }
  onRelease: Function = () => {
    console.log('release');
    this.animate = false;
  };
  onMove: Function = (event) => {
    const {changedTouches} = event.nativeEvent;
    if (changedTouches.length === 2) {
      this.onZoom(event.nativeEvent);
    }
  };
  onZoom() {
    console.log('zoom');
    if (!this.animate) {
      console.log('launching zoomer');
      this.animate = true;
      this.zoomer();
    }
  }
  render() {
    // setInterval(() => {
    //   this.setState({zoom: this.state.zoom + 0.01});
    // }, 100);
    return (
      <Image
        source={this.props.source}
        style={{
          ...this.props.style,
          width: this.state.width,
          height: this.state.height,
          transform: [{scale: this.state.zoom}]
        }}
        {...this.makeHandlers()}
        />
    );
  }
}
