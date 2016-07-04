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
  },
  {
    source: require('../assets/demo-images/3.jpg'),
    width: 480,
    height: 640,
  },
  {
    source: require('../assets/demo-images/4.jpg'),
    width: 400,
    height: 300,
  },
  {
    source: require('../assets/demo-images/5.jpg'),
    width: 400,
    height: 300,
  },
];

export default class App extends Component {
  state = {
    images: [
      images[0],
      images[1],
    ],
    initial: 0,
  };
  render() {
    return this.renderSlider();
  }
  renderSlider() {
    return (
      <Slider
        images={this.state.images}
        initial={this.state.initial}
        loadMoreAfter={this.state.images.length < images.length}
        onEnd={() => {
          if (this.state.images.length < images.length) {
            console.log('load more');
            setTimeout(() => {
              this.setState({
                images: [
                  ...this.state.images,
                  images[this.state.images.length],
                ],
              });
            }, 3000);
          }
        }}
        />
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
