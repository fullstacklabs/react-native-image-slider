import {Dimensions} from 'react-native';

export default (nativeEvent, lastDistance, zoom) => {
  const left: number = nativeEvent.changedTouches[0];
  const right: number = nativeEvent.changedTouches[1];
  const abstractLeft: number = left.pageX + left.pageY;
  const abstractRight: number = right.pageX + right.pageY;
  const distance: number = Math.abs(abstractRight - abstractLeft);

  if (typeof lastDistance === 'number') {
    let direction;
    if (distance > lastDistance) {
      direction = 'in';
    } else if (distance < lastDistance) {
      direction = 'out';
    }
    if (direction) {
      const {width} = Dimensions.get('window');
      const percent = Math.abs(distance / width * 100);
      if (direction === 'in') {
        return zoom + ((zoom / 100 * percent) / 2.5);
      }
      return zoom - ((zoom / 100 * percent) / 5);
    }
  }
};
