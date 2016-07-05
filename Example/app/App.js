/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Slider from './src/components/Slider';

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
  // {
  //   source: require('../assets/5.jpg'),
  //   width: 618,
  //   height: 380,
  // },
  // {
  //   source: require('../assets/6.jpg'),
  //   width: 670,
  //   height: 377,
  // },
  // {
  //   source: require('../assets/7.jpg'),
  //   width: 720,
  //   height: 450,
  // },
  // {
  //   source: require('../assets/8.jpg'),
  //   width: 620,
  //   height: 420,
  // },
  // {
  //   source: require('../assets/9.jpg'),
  //   width: 877,
  //   height: 658,
  // },
  // {
  //   source: require('../assets/10.jpg'),
  //   width: 750,
  //   height: 499,
  // },
  // {
  //   source: require('../assets/12.jpg'),
  //   width: 615,
  //   height: 409,
  // },
  // {
  //   source: require('../assets/13.jpg'),
  //   width: 838,
  //   height: 548,
  // },
  // {
  //   source: require('../assets/14.jpg'),
  //   width: 650,
  //   height: 440,
  // },
  // {
  //   source: require('../assets/15.jpg'),
  //   width: 494,
  //   height: 612,
  // },
  // {
  //   source: require('../assets/16.jpg'),
  //   width: 612,
  //   height: 380,
  // },
  // {
  //   source: require('../assets/18.jpg'),
  //   width: 638,
  //   height: 370,
  // },
];

export default class App extends Component {
  state = {
    images,
    initial: 0,
  };
  render() {
    const loadMoreAfter = this.state.images.length < images.length;
    // const loadMoreAfter = false;
    return (
      <Slider
        images={this.state.images}
        initial={this.state.initial}
        size={2}
        loadMoreAfter={loadMoreAfter}
        onEnd={() => {
          // console.log('on End');
          if (loadMoreAfter) {
            setTimeout(() => {
              // console.log('loading more');
              const nextImages = [];
              for (let i = 0; i < 7; i++) {
                const index = this.state.images.length + i;
                if (images[index]) {
                  nextImages.push(images[index]);
                }
              }
              this.setState({images: [
                ...this.state.images,
                ...nextImages,
              ]});
            }, 2000);
          }
        }}
        />
    );
  }
}
