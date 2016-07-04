/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Slider from './components/Slider';

const images = [
  {
    source: require('../assets/demo-images/1.jpg'),
    width: 247,
    height: 238,
  }
];

export default class App extends Component {
  render() {
    return (
      <Slider images={images} />
    );
  }
}
