import _ from 'lodash';
import {Dimensions, Animated} from 'react-native';
import calculateOffsets from './calculateOffsets';
import type {PROPS} from '../ImageSlider';

export
type CARDINALS = {
  leftOffset: number,
  rightOffset: number,
  cursor: number,
  left: Animated.Value,
  size: number,
  leftBoundary: number,
  rightBoundary: number,
};

export default function calculateCardinals(props: PROPS): CARDINALS {
  const _cursor = props.initial || 0;
  const cursor = _.isNumber(_cursor) && _cursor >= 0 ? _cursor : 0;
  const size = props.size || 10;
  const {start, end} = calculateOffsets(cursor, size, props.images.length);
  const {width} = Dimensions.get('window');
  return {
    size,
    cursor,
    leftBoundary: 0,
    rightBoundary: props.images.length,
    leftOffset: start,
    rightOffset: end,
    left: new Animated.Value(cursor * -width),
  };
}
