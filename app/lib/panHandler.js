import {PanResponder, Dimensions, Animated} from 'react-native';
import type {CARDINALS} from './ImageSlider';

export
type PROPS = {
  left: number,
  cursor: number,
  limit: number,
  onImageChange?: Function,
};

let _previousDistanceX, _previousDistanceY;

export default function panHandler(
    cardinals: CARDINALS,
    handlers: {[handler: string]: Array<Function>},
  ) {
  function onPanResponderMove(event, gestureState) {
    // console.log('onPanResponderMove', {event, gestureState});
    for (const key in event) {
      console.log({key, event: event[key]});
    }
    const {changedTouches, target} = event.nativeEvent;
    console.log(event.nativeEvent);
    if (target === 5 && changedTouches.length === 1) {
      console.log('pinch');
      const dx = gestureState.dx;
      const {width} = Dimensions.get('window');
      cardinals.left.setValue(-(cardinals.cursor * width) + Math.round(dx));
      // let distanceX =
      //   changedTouches[0].locationX - changedTouches[1].locationX;
      // let distanceY =
      //   changedTouches[0].locationY - changedTouches[1].locationY;
      // if (
      //   distanceX > _previousDistanceX ||
      //   distanceY > _previousDistanceY ||
      //   (!_previousDistanceX && !_previousDistanceY)
      // ) {
      //   _previousDistanceX = distanceX;
      //   _previousDistanceY = distanceY;
      //   cardinals._zoom += 0.025;
      //   console.log('^', {zoom: cardinals._zoom});
      //   handlers.onZoom(cardinals);
      // } else if (
      //   distanceX < _previousDistanceX ||
      //   distanceY < _previousDistanceY ||
      //   (!_previousDistanceX && !_previousDistanceY)
      // ) {
      //   _previousDistanceX = distanceX;
      //   _previousDistanceY = distanceY;
      //   cardinals._zoom -= 0.025;
      //   console.log('\\/', {zoom: cardinals._zoom});
      //   if (cardinals._zoom >= 1) {
      //     handlers.onZoom(cardinals);
      //   }
      // }
      // cardinals.zoom.setValue(cardinals._zoom);
    } else {
      event.preventDefault();
      // console.log('isDefaultPrevented', event.isDefaultPrevented());
    }
    return true;
  }

  function release(event, gestureState) {
    // console.log('release', event, gestureState);
    // const {width} = Dimensions.get('window');
    // const relativeDistance = gestureState.dx / width;
    // const vx = gestureState.vx;
    // let change = 0;
    //
    // if (relativeDistance < -0.5 || relativeDistance < 0 && vx <= 0.5) {
    //   change = 1;
    // } else if (relativeDistance > 0.5 || relativeDistance > 0 && vx >= 0.5) {
    //   change = -1;
    // }
    // cardinals.cursor += change;
    // if (cardinals.cursor > (cardinals.rightBoundary - 1)) {
    //   cardinals.cursor = (cardinals.rightBoundary - 1);
    // } else if (cardinals.cursor === -1) {
    //   cardinals.cursor = 0;
    // }
    // handlers.onChange(cardinals);
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
      const {changedTouches} = event.nativeEvent;
      return changedTouches.length === 1;
    },
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderRelease: release,
    // onPanResponderTerminate: release,
    onPanResponderMove,
  }).panHandlers;
}
