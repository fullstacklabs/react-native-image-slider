// @flow
import React, {Component} from 'react';
import {PanResponder, Dimensions, Animated} from 'react-native';
import calculateDimensions from '../lib/calculateDimensions';
import calculateZoom from '../lib/calculateZoom';
import calculateDistance from '../lib/calculateDistance';
import Image from './Image';

type PROPS = {
  width: number,
  height: number,
  source: number|{uri: string},
  [field: string]: any,
  style: any,
  onZoomStart: Function,
  onZoomEnd: Function,
};

type STATE = {
  zoom: Animated.Value,
  width: number,
  height: number,
  marginLeft: Animated.Value,
  _marginLeft: number,
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
    zoom: new Animated.Value(1),
    marginLeft: new Animated.Value(0),
    _marginLeft: 0,
    ...calculateDimensions(this.props.width, this.props.height),
  };
  animate_zoom: boolean = false;
  animate_pan: boolean = false;
  nativeEvent: NATIVE_EVENT;
  lastEvent: NATIVE_EVENT;
  lastDistance: ?number = null;
  panning: boolean = false;
  dx: number = 0;
  zoomer() {
    if (typeof this.lastDistance === 'number') {
      let zoom = calculateZoom(
        this.nativeEvent,
        this.lastDistance,
        this.state.zoom._value,
      );
      if (zoom < 1) {
        zoom = 1;
      }
      if (zoom <= 4) {
        if (
          this.state.zoom._value === 1 &&
          typeof this.props.onZoomStart === 'function'
        ) {
          this.props.onZoomStart();
        }
        if (zoom === 1) {
          this.props.onZoomEnd();
        }
        Animated
          .spring(this.state.zoom, {
            toValue: zoom,
          })
          .start(() => {
            if (this.animate_zoom) {
              return this.zoomer();
            }
          });
      }
    } else {
      this.lastDistance = calculateDistance(this.nativeEvent);
      setTimeout(() => this.zoomer(), 100);
    }
  }
  panner() {
    Animated
      .timing(this.state.marginLeft, {
        toValue: this.state._marginLeft + this.dx,
        duration: 100,
      })
      .start(() => {
        if (this.animate_pan) {
          return this.panner();
        }
        if (Math.abs(this.state._marginLeft + this.dx) > this.props.width) {
          this.dx = 0;
          Animated
            .spring(this.state.marginLeft, {
              toValue: 0,
              friction: 10,
              tension: 50,
            })
            .start(() => this.setState({_marginLeft: 0}));
        }
      });
  }
  makeHandlers(): Object {
    return PanResponder.create({
      onStartShouldSetPanResponder: (event) => {
        const {nativeEvent} = event;
        if (nativeEvent.changedTouches.length === 2) {
          return true;
        }
        return this.state.zoom > 1;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (event) => {
        const {nativeEvent} = event;
        if (nativeEvent.changedTouches.length === 2) {
          return true;
        }
        return this.state.zoom > 1;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderRelease: this.onRelease,
      onPanResponderTerminate: this.onRelease,
      onPanResponderMove: this.onMove,
    }).panHandlers;
  }
  onRelease: Function = (event) => {
    this.lastEvent = this.nativeEvent;
    this.nativeEvent = event.nativeEvent;
    this.animate_zoom = false;
    this.lastDistance = null;
    this.panning = false;
    this.animate_pan = false;
    this.setState({_marginLeft: this.state.marginLeft._value});
  };
  onMove: Function = (event, gestureState) => {
    this.lastEvent = this.nativeEvent;
    this.nativeEvent = event.nativeEvent;
    const {changedTouches} = event.nativeEvent;
    if (changedTouches.length === 2) {
      this.onZoom();
    } else {
      this.onPan(gestureState);
    }
  };
  onZoom() {
    this.panning = false;
    if (!this.animate_zoom) {
      this.animate_zoom = true;
      this.zoomer();
    }
  }
  onPan(gestureState: {dx: number}) {
    if (this.state.zoom._value > 1) {
      this.panning = true;
      if (!this.animate_pan) {
        this.animate_pan = true;
        this.dx = gestureState.dx;
        this.panner();
      } else {
        this.dx = gestureState.dx;
      }
    }
  }
  render() {
    const AnimatedImage = Animated.createAnimatedComponent(Image);
    return (
      <AnimatedImage
        source={this.props.source}
        style={{
          ...this.props.style,
          width: this.state.width,
          height: this.state.height,
          transform: [
            {scale: this.state.zoom},
            {translateX: this.state.marginLeft},
          ]
        }}
        {...this.makeHandlers()}
        />
    );
  }
}
