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
  marginTop: Animated.Value,
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
    marginTop: new Animated.Value(0),
    ...calculateDimensions(this.props.width, this.props.height),
  };
  marginLeft: number = 0;
  marginTop: number = 0;
  animate_zoom: boolean = false;
  animate_pan: boolean = false;
  nativeEvent: NATIVE_EVENT;
  lastEvent: NATIVE_EVENT;
  lastDistance: ?number = null;
  panning: boolean = false;
  dx: number = 0;
  dy: number = 0;
  zoomer(gestureState) {
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
          this.animate_zoom = false;
        }
        if (zoom < 3) {
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
      }
    } else {
      this.lastDistance = calculateDistance(this.nativeEvent);
      setTimeout(() => this.zoomer(), 100);
    }
  }
  panner() {
    const zoom = this.state.zoom._value;
    const {width, height} = Dimensions.get('window');
    const dimensions = calculateDimensions(this.props.width, this.props.height);
    const imageWidth = dimensions.width * zoom;
    const imageHeight = dimensions.height * zoom;
    const halfWidth = imageWidth / 2;
    const _halfWidth = width / 2;
    const leftLimit = (halfWidth - _halfWidth) / zoom;

    let left = this.marginLeft;
    let top = this.marginTop;

    // Don't pan vertical if image height smaller than device height
    if (imageHeight > height) {
      top += this.dy;
    }
    if (Math.abs(this.dx) < width) {
      left += this.dx;
    }

    Animated
      .parallel([
        Animated.timing(this.state.marginLeft, {
          toValue: left,
          duration: 100,
        }),

        Animated.timing(this.state.marginTop, {
          toValue: top,
          duration: 100,
        }),
      ])
      .start(() => {
        if (this.animate_pan) {
          return this.panner();
        }

        // stop pan

        // pan too much left - panning back right a little
        if (left > leftLimit) {
          const zoom = this.state.zoom._value;
          const {width, height} = Dimensions.get('window');
          const dimensions = calculateDimensions(this.props.width, this.props.height);
          const imageWidth = dimensions.width * zoom;
          const imageHeight = dimensions.height * zoom;
          const halfWidth = imageWidth / 2;
          const _halfWidth = width / 2;
          this.marginLeft = (halfWidth - _halfWidth) / zoom;

          Animated
            .spring(this.state.marginLeft, {
              toValue: this.marginLeft,
              friction: 10,
              tension: 100,
            })
            .start();
        } else if (Math.abs(left) > leftLimit) {
          const zoom = this.state.zoom._value;
          const {width, height} = Dimensions.get('window');
          const dimensions = calculateDimensions(this.props.width, this.props.height);
          const imageWidth = dimensions.width * zoom;
          const imageHeight = dimensions.height * zoom;
          const halfWidth = imageWidth / 2;
          const _halfWidth = width / 2;
          const leftX = (halfWidth - _halfWidth) / zoom;
          this.marginLeft = (((halfWidth - _halfWidth) / zoom) - ((halfWidth / zoom)) / 2);

          console.log(this.marginLeft);

          Animated
            .spring(this.state.marginLeft, {
              toValue: this.marginLeft,
              friction: 10,
              tension: 100,
            })
            .start();
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
        return this.state.zoom._value > 1;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (event) => {
        const {nativeEvent} = event;
        if (nativeEvent.changedTouches.length === 2) {
          return true;
        }
        return this.state.zoom._value > 1;
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
    this.marginLeft = this.state.marginLeft._value;
    this.marginTop = this.state.marginTop._value;
  };
  onMove: Function = (event, gestureState) => {
    this.lastEvent = this.nativeEvent;
    this.nativeEvent = event.nativeEvent;
    const {changedTouches} = event.nativeEvent;
    if (changedTouches.length === 2) {
      this.onZoom(gestureState);
    } else {
      this.onPan(gestureState);
    }
  };
  onZoom(gestureState) {
    this.panning = false;
    if (!this.animate_zoom) {
      this.animate_zoom = true;
      this.zoomer(gestureState);
    }
  }
  onPan(gestureState: {dx: number, dy: number}) {
    if (this.state.zoom._value > 1) {
      this.panning = true;
      if (!this.animate_pan) {
        this.animate_pan = true;
        this.dx = gestureState.dx;
        this.dy = gestureState.dy;
        this.panner();
      } else {
        this.dx = gestureState.dx;
        this.dy = gestureState.dy;
      }
    }
  }
  render() {
    return (
      <Image
        source={this.props.source}
        style={{
          ...this.props.style,
          width: this.state.width,
          height: this.state.height,
          transform: [
            {scale: this.state.zoom},
            {translateX: this.state.marginLeft},
            {translateY: this.state.marginTop},
          ]
        }}
        {...this.makeHandlers()}
        />
    );
  }
}
