import React from 'react';
import {Animated} from 'react-native';
import Zoom from './Zoom';

export default (props) => {
  return (
    <Animated.View style={{marginTop: 150}}>
      {props.images.map((image, key) => <Zoom {...image} key={key} />)}
    </Animated.View>
  );
};
