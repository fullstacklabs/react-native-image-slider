import _ from 'lodash';

export
type OFFSETS = {
  left: number,
  right: number,
};

export
type PADDINGS = {
  is_odd: boolean,
  half: number,
  left: number,
  right: number,
};

export default function calculateOffsets(
    cursor: number,
    size: number,
    outbound: number,
  ): OFFSETS {
  let left: ?number, right: ?number;

  const is_odd: boolean = Boolean(size % 2);
  const half: number = size / 2;

  const paddings: PADDINGS = {
    is_odd,
    half,
    left: is_odd ? Math.floor(half) : half,
    right: is_odd ? Math.ceil(half) : half,
  };

  left = cursor - paddings.left;

  if (left < 0) {
    left = 0;
  }

  if (!_.isNumber(left)) {
    throw new Error('Could not find out left offset');
  }

  right = left + size;

  if (right > outbound) {
    right = outbound;
  }

  return {left, right};
}
