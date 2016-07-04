// @flow
import React, {Component} from 'react';
import {PanResponder, Dimensions} from 'react-native';
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

type TOUCH = {
  pageX: number,
  pageY: number,
};

type NATIVE_EVENT = {
  changedTouches: Array<TOUCH>,
};

export default class ZoomImage extends Component {
  props: PROPS;
  state: STATE = {
    zoom: 1,
    ...scale(this.props.width, this.props.height),
  };
  animate: boolean = false;
  nativeEvent: NATIVE_EVENT;
  lastEvent: NATIVE_EVENT;
  lastDistance: ?number = null;
  lastZoom: ?number = null;
  zoomer() {
    if (this.animate) {
      const left = this.nativeEvent.changedTouches[0];
      const right = this.nativeEvent.changedTouches[1];
      const abstractLeft = left.pageX + left.pageY;
      const abstractRight = right.pageX + right.pageY;
      const distance: number = Math.abs(abstractRight - abstractLeft);
      if (typeof this.lastDistance === 'number') {
        let direction;
        if (distance > this.lastDistance) {
          direction = 'in';
        } else if (distance < this.lastDistance) {
          direction = 'out';
        }
        if (direction) {
          const {width} = Dimensions.get('window');
          const percent = Math.abs(distance / width * 100);
          let {zoom} = this.state;
          if (direction === 'in') {
            zoom += ((this.state.zoom / 100 * percent) / 10);
          } else {
            zoom -= ((this.state.zoom / 100 * percent) / 10);
          }
          console.log(
            direction,
            `${this.lastDistance}..${distance}`,
            `(${this.lastDistance - distance})`,
            `${Math.floor(percent)}%`,
            `x${zoom.toFixed(2)}`,
            this.state.zoom.toFixed(2),
          );
          this.setState(
            {zoom},
            () => {
              setTimeout(() => this.zoomer(), 100);
            },
          );
        }
      }
      this.lastDistance = distance;
      setTimeout(() => this.zoomer(), 100);
    }
  }
  makeHandlers(): Object {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderRelease: this.onRelease,
      onPanResponderTerminate: this.onRelease,
      onPanResponderMove: this.onMove,
    }).panHandlers;
  }
  onRelease: Function = (event) => {
    console.log('release');
    this.lastEvent = this.nativeEvent;
    this.nativeEvent = event.nativeEvent;
    this.animate = false;
    this.lastDistance = null;
  };
  onMove: Function = (event) => {
    this.lastEvent = this.nativeEvent;
    this.nativeEvent = event.nativeEvent;
    const {changedTouches} = event.nativeEvent;
    if (changedTouches.length === 2) {
      this.onZoom(event.nativeEvent);
    }
  };
  onZoom() {
    if (!this.animate) {
      this.animate = true;
      this.zoomer();
    }
  }
  render() {
    // setInterval(() => {
    //   if (this.state.zoom > 4) return;
    //   this.setState({zoom: this.state.zoom + 0.01});
    // }, 500);
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
