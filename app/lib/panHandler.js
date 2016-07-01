import {PanResponder, Dimensions} from 'react-native';
import type {CARDINALS} from './ImageSlider';

export
type PROPS = {
  left: number,
  cursor: number,
  limit: number,
  onImageChange?: Function,
};

export default function panHandler(
    cardinals: CARDINALS,
    handlers: {[handler: string]: Array<Function>},
  ) {

  function onPanResponderMove(event, gestureState) {
    // console.log('onPanResponderMove', {event, gestureState});
    const dx = gestureState.dx;
    const {width} = Dimensions.get('window');
    cardinals.left.setValue(-(cardinals.cursor * width) + Math.round(dx));
  }

  function onStartShouldSetPanResponder(event, gestureState) {
    // console.log('onStartShouldSetPanResponder', {event, gestureState});
    return true;
  }

  function release(event, gestureState) {
    console.log('release', event, gestureState);
    const {width} = Dimensions.get('window');
    const relativeDistance = gestureState.dx / width;
    const vx = gestureState.vx;
    let change = 0;

    if (relativeDistance < -0.5 || relativeDistance < 0 && vx <= 0.5) {
      change = 1;
    } else if (relativeDistance > 0.5 || relativeDistance > 0 && vx >= 0.5) {
      change = -1;
    }
    cardinals.cursor += change;
    if (
      change && cardinals.cursor >= 0 &&
      cardinals.cursor < cardinals.rightBoundary
    ) {
      console.log({cardinals});
      console.log('..........................................');
      if (typeof handlers.onChange === 'function') {
        handlers.onChange(cardinals);
      }
    }
    // move();
  }

  // function move() {
  //   if (cursor === leftOffset) {
  //     leftOffset -= size;
  //     if (leftOffset < 0) {
  //       leftOffset = 0;
  //     }
  //     this.setState({leftOffset, should_update: true});
  //   } else if (cursor === (rightOffset - 1)) {
  //     if (rightOffset < rightBoundary) {
  //       rightOffset += size;
  //       if (rightOffset > rightBoundary) {
  //         rightOffset = rightBoundary;
  //       }
  //       this.setState({rightOffset, should_update: true});
  //     }
  //   }
  //
  //
  //
  //   if (this.props.onImageChange) {
  //     this.props.onImageChange(this.props.images[cursor]);
  //   }
  // }

  return PanResponder.create({
    onStartShouldSetPanResponder,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderRelease: release,
    onPanResponderTerminate: release,
    onPanResponderMove,
  }).panHandlers;
}
