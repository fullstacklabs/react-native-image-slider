/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Slider, {Zoom} from 'react-native-image-slider';

type IMAGE = {
  source: number,
  width: number,
  height: number,
};

const images = [
  {
    source: require('../assets/1.jpg'),
    width: 768,
    height: 433,
  },
  {
    source: require('../assets/2.jpg'),
    width: 600,
    height: 418,
  },
  {
    source: require('../assets/3.jpg'),
    width: 600,
    height: 318,
  },
  {
    source: require('../assets/4.jpg'),
    width: 500,
    height: 583,
  },
  {
    source: require('../assets/5.jpg'),
    width: 618,
    height: 380,
  },
  {
    source: require('../assets/6.jpg'),
    width: 670,
    height: 377,
  },
  {
    source: require('../assets/7.jpg'),
    width: 720,
    height: 450,
  },
  {
    source: require('../assets/8.jpg'),
    width: 620,
    height: 420,
  },
  {
    source: require('../assets/9.jpg'),
    width: 877,
    height: 658,
  },
  {
    source: require('../assets/10.jpg'),
    width: 750,
    height: 499,
  },
  {
    source: require('../assets/12.jpg'),
    width: 615,
    height: 409,
  },
];

export default class App extends Component {
  state = {
    images: [
      images[0],
      images[1],
      images[2],
      images[3],
      images[4],
      images[5],
      // images[6],
      // images[7],
      // images[8],
      // images[9],
    ],
    initial: 0,
  };
  render() {
    return this.renderSlider();
  }
  renderSlider() {
    const loadMoreAfter = this.state.images.length < images.length;
    // const loadMoreAfter = false;
    return (
      <Slider
        images={this.state.images}
        initial={this.state.initial}
        loadMoreAfter={loadMoreAfter}
        onEnd={() => {
          if (loadMoreAfter) {
            console.log('load more');
            setTimeout(() => {
              this.setState({
                images: [
                  ...this.state.images,
                  images[this.state.images.length],
                  images[this.state.images.length + 1],
                  images[this.state.images.length + 2],
                  images[this.state.images.length + 3],
                ],
              });
            }, 2000);
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
