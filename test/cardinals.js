import calculateCardinals from '../src/lib/calculateCardinals';
import _ from 'lodash';
import 'colors';
import assert from './assert';

const ios = [
  {
    input: {
      images: Array(2),
    },
    output: {
      size: 10,
      cursor: 0,
      offsets: {
        left: 0,
        right: 2,
      },
      boundaries: {
        left: 0,
        right: 2,
      }
    }
  },
  {
    input: {
      images: Array(20),
    },
    output: {
      size: 10,
      cursor: 0,
      offsets: {
        left: 0,
        right: 10,
      },
      boundaries: {
        left: 0,
        right: 20,
      }
    }
  },
];

ios.forEach(test => {
  try {
    console.log({input: test.input, expected: test.output});
    const cardinals = calculateCardinals(test.input);
    console.log({output: cardinals});
    assert('cardinals is an object', _.isObject(cardinals));
    for (const attr in test.output) {
      if (typeof test.output[attr] === 'object') {
        for (const key in test.output[attr]) {
          assert(`${attr} ${key} is ${test.output[attr][key]}`,
            cardinals[attr][key] === test.output[attr][key]);
        }
      } else {
        assert(`${attr} is ${test.output[attr]}`,
          cardinals[attr] === test.output[attr]);
      }
    }
  } catch (error) {
    console.log(error.stack.red);
    throw error;
  }
});
