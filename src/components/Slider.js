// @flow
import React, {Component} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  View,
  ActivityIndicator,
} from 'react-native';
import Zoom from './Zoom';
import calculateCardinals from '../lib/calculateCardinals';
import type {CARDINALS} from '../lib/calculateCardinals';

export
type STATE = CARDINALS;

export
type IMAGE = {
  width: number,
  height: number,
  source: number|{uri: string},
};

export
type PROPS = {
  images: Array<IMAGE>,
  initial?: number,
  onEnd?: Function,
  loadMoreAfter?: boolean,
};

export default class Slider extends Component {
  props: PROPS;
  zooming: boolean = false;
  state: STATE = {
    ...calculateCardinals(this.props),
  };
  componentWillReceiveProps(props: PROPS) {
    console.log('NEW PROPS!', props);
    const cardinals = calculateCardinals(props);
    const {
      size,
      leftBoundary,
      rightBoundary,
      leftOffset,
      rightOffset,
    } = cardinals;
    this.setState({
      size,
      leftBoundary,
      rightBoundary,
      leftOffset,
      rightOffset,
    });
  }
  shouldComponentUpdate(props: PROPS, state: STATE): boolean {
    if (
      state.cursor !== this.state.cursor &&
      state.rightOffset === this.state.rightOffset
    ) {
      console.log('canceling Slider update because cursor change is minor');
      return false;
    }
    return true;
  }
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
    const newState = {};

    if (relativeDistance < -0.5 || relativeDistance < 0 && vx <= 0.5) {
      change = 1;
    } else if (relativeDistance > 0.5 || relativeDistance > 0 && vx >= 0.5) {
      change = -1;
    }
    console.log({cursor: this.state.cursor});
    let {cursor, rightBoundary, rightOffset} = this.state;
    cursor += change;
    if (cursor > (rightOffset - 1)) {
      if (rightOffset < rightBoundary) {
        newState.rightOffset = rightOffset + this.state.size;
        if (newState.rightOffset > rightBoundary) {
          newState.rightOffset = rightBoundary;
        }
      } else {
        newState.rightOffset = rightOffset + this.state.size;
        if (newState.rightOffset > rightBoundary) {
          newState.rightOffset = rightBoundary;
          if (!this.props.loadMoreAfter) {
            cursor -= change;
          }
        }
      }
    }
    if (cursor > (rightBoundary - 1)) {
      if (typeof this.props.onEnd === 'function') {
        this.props.onEnd();
      }
      cursor = (rightBoundary - 1);
      if (this.props.loadMoreAfter) {
        cursor = rightBoundary;
      }
    }
    if (cursor === -1) {
      cursor = 0;
    }
    console.log({cursor, rightOffset, rightBoundary});
    Animated
      .spring(this.state.left, {
        toValue: cursor * -width,
        friction: 10,
        tension: 100,
      })
      .start(() => {
        console.log({newState});
        if (newState.rightOffset) {
          this.setState({cursor, ...newState});
        } else {
          this.state.cursor = cursor;
          Object.assign(this.state, newState);
        }
      });
  }
  move(event, gestureState) {
    const dx = gestureState.dx;
    const {width} = Dimensions.get('window');
    this.state.left.setValue(-(this.state.cursor * width) + Math.round(dx));
  }
  render() {
    console.log(this);
    const {width, height} = Dimensions.get('window');
    let totalWidth = width * (this.state.rightOffset - this.state.leftOffset);
    if (this.props.loadMoreAfter) {
      totalWidth += width;
    }
    if (this.state.rightOffset < this.state.rightBoundary) {
      totalWidth += width;
    }
    return (
      <Animated.View
        style={{
          backgroundColor: 'black',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width: totalWidth,
          transform: [
            {translateX: this.state.left},
          ],
        }}
        {...this.makeHandlers()}
        >
        {
          this.props.images
            .map((image, key) => {
              if (
                key >= this.state.leftOffset && key < this.state.rightOffset
              ) {
                return (
                  <Zoom
                    key={key}
                    {...image}
                    onZoomStart={() => {
                      this.zooming = true;
                    }}
                    onZoomEnd={() => {
                      this.zooming = false;
                    }}
                    onLoaded={() => console.log('Image loaded', key)}
                    />
                );
              }
              return <View key={key} />;
            })
        }
        {this.state.rightOffset < this.state.rightBoundary &&
          <View
            style={{
              width,
              height,
            }}
            >
            <ActivityIndicator
              color="white"
              size="large"
              style={{
                flex: 1,
              }}
              />
          </View>
        }
        {this.props.loadMoreAfter &&
          <View
            style={{
              width,
              height,
            }}
            >
            <ActivityIndicator
              color="white"
              size="large"
              style={{
                flex: 1,
              }}
              />
          </View>
        }
      </Animated.View>
    );
  }
}
