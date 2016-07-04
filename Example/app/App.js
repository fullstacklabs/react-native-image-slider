/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import Slider from '../../Slider';
import Zoom from '../../src/components/Zoom';

const images = [
  {
    source: require('../assets/demo-images/1.jpg'),
    width: 768,
    height: 433,
  },
  {
    source: require('../assets/demo-images/2.jpg'),
    width: 600,
    height: 418,
  },
  {
    source: require('../assets/demo-images/3.jpg'),
    width: 600,
    height: 318,
  },
  {
    source: require('../assets/demo-images/4.jpg'),
    width: 500,
    height: 583,
  },
  {
    source: require('../assets/demo-images/5.jpg'),
    width: 618,
    height: 380,
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
