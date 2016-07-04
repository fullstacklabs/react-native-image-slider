import _ from 'lodash';
import {Dimensions, Animated} from 'react-native';
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

function calculateOffsets(cursor, size, outbound) {
  const is_odd = Boolean(size % 2),
    half = size / 2,
    padding_left = is_odd ? Math.floor(half) : half,
    padding_right = is_odd ? Math.ceil(half) : half,
    left = cursor - padding_left,
    right = cursor + padding_right;
  let start = left > -1 ? left : 0,
    end = right;
  if (left < -1) {
    end += Math.abs(left);
  }
  if (end > outbound) {
    end = outbound;
  }
  if (end - start < size && start > 0) {
    start = end - size;
  }
  return {start, end};
}

export default function calculateCardinals(props: PROPS): CARDINALS {
  const _cursor = _.findIndex(props.images, {id: props.initial});
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
