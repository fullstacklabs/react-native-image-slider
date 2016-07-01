import React from 'react';
import {ActivityIndicator, Dimensions} from 'react-native';

export default () => {
  const {width, height} = Dimensions.get('window');
  return <ActivityIndicator
    animating={true}
    size="large"
    style={{
      position: 'absolute',
      top: (height / 2) - (36 / 2),
      left: (width / 2) - (36 / 2),
    }}
    />;
};
