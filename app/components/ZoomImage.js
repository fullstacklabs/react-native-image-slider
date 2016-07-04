// @flow
import React, {Component} from 'react';
import {PanResponder, Dimensions, Animated} from 'react-native';
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
  zoom: Animated.Value,
  width: number,
  height: number,
  marginLeft: Animated.Value,
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
    ...scale(this.props.width, this.props.height),
  };
  animate_zoom: boolean = false;
  animate_pan: boolean = false;
  nativeEvent: NATIVE_EVENT;
  lastEvent: NATIVE_EVENT;
  lastDistance: ?number = null;
  panning: boolean = false;
  dx: number = 0;
  zoomer() {
    if (this.animate_zoom) {
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
          zoom = zoom._value;
          if (direction === 'in') {
            zoom += ((zoom / 100 * percent) / 10);
          } else {
            zoom -= ((zoom / 100 * percent) / 10);
          }
          if (zoom >= 1) {
            Animated
              .spring(this.state.zoom, {
                toValue: zoom,
              })
              .start(() => this.zoomer());
          }
        }
      }
      this.lastDistance = distance;
      setTimeout(() => this.zoomer(), 100);
    }
  }
  panner() {
    console.log('panning', this.state._marginLeft + this.dx, this.props.width);
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
          console.log('???');
          Animated
            .spring(this.state.marginLeft, {
              toValue: 0,
              friction: 10,
              tension: 50,
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
        return this.state.zoom > 1;
      },
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
    this.animate_zoom = false;
    this.lastDistance = null;
    if (this.panning) {
      // setTimeout(() => {
      //   Animated
      //     .spring(this.state.marginLeft, {
      //       toValue: 0,
      //     })
      //     .start(() => {
      //       console.log('.............');
      //     });
      // }, 150);
    }
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
    this.panning = true;
    if (!this.animate_pan) {
      this.animate_pan = true;
      this.dx = gestureState.dx;
      this.panner();
    } else {
      this.dx = gestureState.dx;
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
