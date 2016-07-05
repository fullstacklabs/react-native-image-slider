import calculateOffsets from '../src/lib/calculateOffsets';
import _ from 'lodash';
import 'colors';

const ios = [
  {
    input: {
      cursor: 0,
      size: 10,
      outbound: 10,
    },
    output: {
      left: 0,
      right: 10,
    }
  },
  {
    input: {
      cursor: 0,
      size: 2,
      outbound: 4,
    },
    output: {
      left: 0,
      right: 2,
    }
  },
  {
    input: {
      cursor: 2,
      size: 2,
      outbound: 4,
    },
    output: {
      left: 1,
      right: 3,
    }
  },
  {
    input: {
      cursor: 0,
      size: 10,
      outbound: 4,
    },
    output: {
      left: 0,
      right: 4,
    }
  },
];

function assert(label, thing) {
  console.log(
    ' ', (thing ? '√'.green : 'X'.red), label[thing ? 'green' : 'red']
  );
  if (!thing) {
    throw new Error(label);
  }
}

ios.forEach(test => {
  try {
    console.log({input: test.input, expected: test.output});
    const offsets = calculateOffsets(
      test.input.cursor,
      test.input.size,
      test.input.outbound,
    );
    console.log({output: offsets});
    assert('offsets is an object', _.isObject(offsets));
    assert(`offsets lefts at ${test.output.left}`,
      offsets.left === test.output.left);
    assert(`offsets rights at ${test.output.right}`,
      offsets.right === test.output.right);
  } catch (error) {
    console.log(error.stack.red);
    throw error;
  }
});
