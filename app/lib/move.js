import {Dimensions} from 'react-native';

export default (event, gestureState) => {
  // console.log('onPanResponderMove', {event, gestureState});
  const {nativeEvent} = event;
  if (nativeEvent.touches.length === 2) {

  } else {
    const {dx} = gestureState;
    const {width} = Dimensions.get('window');
    cardinals.left.setValue(-(cardinals.cursor * width) + Math.round(dx));
  }
}
