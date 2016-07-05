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
type STATE = {
  changed: number,
  reason: ?string,
};

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
  state: STATE = {changed: 0};
  zooming: boolean = false;
  cardinals: CARDINALS = calculateCardinals(this.props);
  componentDidMount() {
    console.log('did mount');
    console.log(
      `${this.cardinals.cursor}/${this.cardinals.rightOffset}..${this.cardinals.rightBoundary}`
    );
  }
  componentWillReceiveProps(props: PROPS) {
    console.log('<Slider> will receive props');
    const cardinals = calculateCardinals({
      ...props,
      // initial: this.state.cursor,
    });
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
  componentDidUpdate() {
    console.log('<Slider> updated');
    console.log(
      `${this.cardinals.cursor}/${this.cardinals.rightOffset}..${this.cardinals.rightBoundary}`
    );
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

    /*
     *  Left boundary    Left offset    Cursor   Right offset    Right boundary
     *  |--------------------|------------|-----------|-----------------------|
    */

    const {cursor, rightOffset, rightBoundary} = this.cardinals;
    let newCursor = cursor + change;
    const rightOffsetSensor = rightOffset - 1;

    if (change > 0) {
      if (cursor === rightOffsetSensor) {
        if (rightOffset === rightBoundary) {
          newCursor = cursor;
        }
      }
    } else if (change < 0) {
      if (newCursor === -1) {
        newCursor = cursor;
      }
    }

    console.log({change, cursor, newCursor, rightOffset, rightOffsetSensor});

    Animated
      .spring(this.cardinals.left, {
        toValue: newCursor * -width,
        friction: 10,
        tension: 100,
      })
      .start(() => {
        // if (newState.rightOffset) {
        //   this.setState({cursor, ...newState});
        // } else {
        //   this.state.cursor = cursor;
        //   Object.assign(this.state, newState);
        // }
        this.cardinals.cursor = newCursor;
      });


    // let {cursor, rightBoundary, rightOffset} = this.state;
    // cursor += change;
    // if (cursor > (rightOffset - 1)) {
    //   if (rightOffset < rightBoundary) {
    //     newState.rightOffset = rightOffset + this.state.size;
    //     if (newState.rightOffset > rightBoundary) {
    //       newState.rightOffset = rightBoundary;
    //     }
    //   } else {
    //     newState.rightOffset = rightOffset + this.state.size;
    //     if (newState.rightOffset > rightBoundary) {
    //       newState.rightOffset = rightBoundary;
    //       if (!this.props.loadMoreAfter) {
    //         cursor -= change;
    //       }
    //     }
    //   }
    // }
    // if (cursor > (rightBoundary - 1)) {
    //   if (typeof this.props.onEnd === 'function') {
    //     this.props.onEnd();
    //   }
    //   cursor = (rightBoundary - 1);
    //   if (this.props.loadMoreAfter) {
    //     cursor = rightBoundary;
    //   }
    // }
    // if (cursor === -1) {
    //   cursor = 0;
    // }
  }
  move(event, gestureState) {
    const {dx} = gestureState;
    const {width} = Dimensions.get('window');
    const left = -(this.cardinals.cursor * width) + Math.round(dx);
    this.cardinals.left.setValue(left);
  }
  render() {
    const {width, height} = Dimensions.get('window');
    const {cardinals} = this;
    let totalWidth = width * (cardinals.rightOffset - cardinals.leftOffset);
    if (this.props.loadMoreAfter) {
      totalWidth += width;
    }
    if (cardinals.rightOffset < cardinals.rightBoundary) {
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
            {translateX: cardinals.left},
          ],
        }}
        {...this.makeHandlers()}
        >
        {
          this.props.images
            .map((image, key) => {
              if (
                key >= cardinals.leftOffset && key < cardinals.rightOffset
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
        {cardinals.rightOffset < cardinals.rightBoundary &&
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
