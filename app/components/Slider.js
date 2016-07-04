import React, {Component} from 'react';
import {Animated, Dimensions, PanResponder} from 'react-native';
import Zoom from './Zoom';
import calculateCardinals from '../lib/calculateCardinals';
import type {CARDINALS} from '../lib/calculateCardinals';

export
type STATE = CARDINALS;

export default class Slider extends Component {
  zooming: boolean = false;
  state: STATE = {
    ...calculateCardinals(this.props),
  };
  makeHandlers(): Object {
    return PanResponder.create({
      onStartShouldSetPanResponder: (event) => {
        const {nativeEvent} = event;
        return nativeEvent.changedTouches.length === 1 && !this.zooming;
      },
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (event) => {
        const {nativeEvent} = event;
        return nativeEvent.changedTouches.length === 1 && !this.zooming;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderRelease: this.release.bind(this),
      onPanResponderTerminate: this.release.bind(this),
      onPanResponderMove: this.move.bind(this),
    }).panHandlers;
  }
  release(event, gestureState) {
    const {width} = Dimensions.get('window');
    const relativeDistance = gestureState.dx / width;
    const vx = gestureState.vx;
    let change = 0;

    if (relativeDistance < -0.5 || relativeDistance < 0 && vx <= 0.5) {
      change = 1;
    } else if (relativeDistance > 0.5 || relativeDistance > 0 && vx >= 0.5) {
      change = -1;
    }
    let {cursor, rightBoundary} = this.state;
    cursor += change;
    if (cursor > (rightBoundary - 1)) {
      cursor = (rightBoundary - 1);
    } else if (cursor === -1) {
      cursor = 0;
    }
    this.setState({cursor}, () => {
      Animated
        .spring(this.state.left, {
          toValue: cursor * -width,
          friction: 10,
          tension: 50,
        })
        .start();
    });
  }
  move(event, gestureState) {
    const dx = gestureState.dx;
    const {width} = Dimensions.get('window');
    this.state.left.setValue(-(this.state.cursor * width) + Math.round(dx));
  }
  render() {
    const {width, height} = Dimensions.get('window');
    return (
      <Animated.View
        style={{
          backgroundColor: 'black',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width: width * this.props.images.length,
          transform: [
            {translateX: this.state.left},
          ],
        }}
        {...this.makeHandlers()}
        >
        {this.props.images.map((image, key) =>
          <Zoom
            key={key}
            {...image}
            onZoomStart={() => {
              console.log('zoom start');
              this.zooming = true;
            }}
            onZoomEnd={() => {
              console.log('zoom end');
              this.zooming = false;
            }}
            />
        )}
      </Animated.View>
    );
  }
}
