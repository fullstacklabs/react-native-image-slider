// @flow
import React, {Component} from 'react';
import {
  View,
  Animated,
} from 'react-native';

export
type IMAGE = {
  id: string,
  url: string,
  width: number,
  height: number,
};

export
type PROPS = {
  images: Array<IMAGE>
};

export
type STATE = {
  leftOffset: number,
  rightOffset: number,
};

export default class ImageSlider extends Component {
  props: PROPS;
  state: STATE = {
    leftOffset: 0,
    rightOffset: 0,
  };
  render() {
    return (
      <View>
        <Animated.View>
          {this.props.images.map((image, index) => {
            if (index >= this.state.leftOffset &&
              index <= this.state.rightOffset) {
              return this._renderImage(image, index);
            }
            return <View key={index} style={{width: WIDTH}} />;
          })}
        </Animated.View>
      </View>
    );
  }
}
