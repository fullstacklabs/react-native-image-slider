import _ from 'lodash';
import calculateOffsets from './calculateOffsets';
import type {PROPS} from '../components/Slider';

export
type CARDINALS = {
  size: number,
  cursor: number,
  offsets: {
    left: number,
    right: number,
  },
  boundaries: {
    left: number,
    right: number,
  }
};

export default function calculateCardinals(props: PROPS): CARDINALS {
  const size = props.size || 10;
  const _cursor = props.initial || 0;
  const cursor = _.isNumber(_cursor) && _cursor >= 0 ? _cursor : 0;
  return {
    size,
    cursor,
    offsets: calculateOffsets(cursor, size, props.images.length),
    boundaries: {
      left: 0,
      right: props.images.length,
    },
  };
}
