/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Slider from './components/Slider';
import Zoom from './components/Zoom';

const images = [
  {
    source: require('../assets/demo-images/1.jpg'),
    width: 247,
    height: 238,
  },
  {
    source: require('../assets/demo-images/2.jpg'),
    width: 640,
    height: 480,
  }
];

export default class App extends Component {
  render() {
    return this.renderSlider();
  }
  renderSlider() {
    return (
      <Slider images={images} />
    );
  }
  renderZoom() {
    return <Zoom
      style={{marginTop: 150}}
      {...images[0]}
      onZoomStart={() => {
      }}
      onZoomEnd={() => {
      }}
      />;
  }
}
