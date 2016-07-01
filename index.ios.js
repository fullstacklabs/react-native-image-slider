/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, View} from 'react-native';
import ImageSlider from './app/ImageSlider';

const images = [
  {
    id: 0,
    url: 'https://pbs.twimg.com/profile_images/1159697491/normal_7.jpg',
    width: 247,
    height: 238,
  },
  {
    id: 1,
    url: 'https://lh5.googleusercontent.com/-6_pwkiZp5-A/AAAAAAAAAAI/AAAAAAAAFII/v_jXXN9rS38/photo.jpg',
    width: 414,
    height: 414,
  },
  {
    id: 2,
    url: 'http://archive.eusa.eu/files/News/2012/photoc-camera_w2.jpg',
    width: 550,
    height: 357,
  },
  {
    id: 3,
    url: 'https://lh3.googleusercontent.com/G6TdMI2ub9HExEE1Y6meMCRC8bT_3em7VtHIU-_G42vRUaNlPBLO842Ur90mZzFRs8c=h900',
    width: 571,
    height: 900,
  },
  {
    id: 4,
    url: './assets/demo-images/1.jpg',
    width: 6016,
    height: 4000,
  },
  {
    id: 5,
    url: 'https://static.pexels.com/photos/7976/pexels-photo.jpg',
    width: 6016,
    height: 4000,
  },
];

class App extends Component {
  render() {
    console.log('=== render ===', this);
    return (
      <View style={{
        marginTop: 32,
      }}>
        <ImageSlider images={images} />
      </View>
    );
  }
}

AppRegistry.registerComponent('FSLReactNativeImageSlider', () => App);
