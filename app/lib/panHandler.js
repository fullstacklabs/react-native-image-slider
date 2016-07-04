import {PanResponder, Dimensions, Animated} from 'react-native';
import type {CARDINALS} from './ImageSlider';

export
type PROPS = {
  left: number,
  cursor: number,
  limit: number,
  onImageChange?: Function,
};

let _previousX = null,
  _previousY = null;

export default function panHandler(
    cardinals: CARDINALS,
    handlers: {[handler: string]: Array<Function>},
  ) {
  function onPanResponderMove(event, gestureState) {
    const {changedTouches, pageX, pageY} = event.nativeEvent;
    if (changedTouches.length === 1) {
      console.log('move.', cardinals._zoom);
      const dx = gestureState.dx;
      const {width} = Dimensions.get('window');
      if (cardinals.zooms.every(zoom => zoom._value === 1)) {
        cardinals.left.setValue(-(cardinals.cursor * width) + Math.round(dx));
      } else {
        cardinals.left.setValue(-(cardinals.cursor * width) + Math.round(dx));
      }
    } else {
      const zoom = cardinals.zooms[cardinals.cursor]._value;
      console.log('....');
      if (_previousX !== null) {
        if (pageX < _previousX || pageY < _previousY) {
          cardinals.zooms[cardinals.cursor].setValue(zoom + 0.01);
        } else if (zoom >= 1.01) {
          cardinals.zooms[cardinals.cursor].setValue(zoom - 0.01);
        }
      }
      _previousX = pageX;
      _previousY = pageY;
    }
    return true;
  }

  function release(event, gestureState) {
    const {changedTouches} = event.nativeEvent;
    if (changedTouches.length === 1) {
      if (cardinals.zooms.every(zoom => zoom._value === 1)) {
        
      }
    } else {
      _previousX = null;
      _previousY = null;
    }
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
    onStartShouldSetPanResponder: (event) => {
      return true;
      const {changedTouches} = event.nativeEvent;
      console.log('start', changedTouches.length);
      for (const key in event) {
        console.log({key, type: typeof event[key], event: event[key]});
      }
      event.persist();
      return changedTouches.length === 1;
    },
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (event) => {
      return true;
      const {changedTouches} = event.nativeEvent;
      return changedTouches.length === 1;
    },
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderRelease: release,
    // onPanResponderTerminate: release,
    onPanResponderMove,
  }).panHandlers;
}
