import React, {Component} from 'react';
import {Animated, Dimensions} from 'react-native';
import Zoom from './Zoom';

export default class Slider extends Component {
  render() {
    const {width, height} = Dimensions.get('window');
    return (
      <Animated.View
        style={{
          backgroundColor: 'black',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width: width * this.props.images.length,
        }}
        >
        {this.props.images.map((image, key) => <Zoom {...image} key={key} />)}
      </Animated.View>
    );
  }
}
