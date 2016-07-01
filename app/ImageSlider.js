// @flow
import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import Image from './Image';
import scale from './lib/scale';
import panHandler from './lib/panHandler';
import calculateCardinals from './lib/calculateCardinals';

export
type IMAGE = {
  id: string|number,
  url: string,
  width: number,
  height: number,
};

export
type PROPS = {
  images: Array<IMAGE>,
  size?: number,
  initial?: string|number,
};

export
type CARDINALS = {
  leftOffset: number,
  rightOffset: number,
  cursor: number,
  left: Animated.Value,
  size: number,
  leftBoundary: number,
  rightBoundary: number,
  limit: number,
};

export
type STATE = CARDINALS;

export default class ImageSlider extends Component {
  props: PROPS;
  state: STATE = {...calculateCardinals(this.props)};
  onChange: Function = (cardinals: CARDINALS) => {
    console.log({cardinals});
    const {left, cursor} = cardinals;
    const _width = Dimensions.get('window').width;
    // this.setState({left}, () => {
    Animated.spring(left, {
      toValue: cursor * -_width,
      friction: 10,
      tension: 50,
    }).start();
    // });
  };
  render() {
    console.log('=== render ===', this);
    const {height, width} = Dimensions.get('window');
    return (
      <Animated.View
        {...panHandler(this.state, {onChange: this.onChange})}
        style={[
          styles.container,
          {
            transform: [{translateX: this.state.left}],
            height,
            width: this.props.images.length * width,
          },
        ]}
        >
        {this.renderImages()}
      </Animated.View>
    );
  }
  renderImages() {
    const {width} = Dimensions.get('window');
    return this.props.images.map((image, index) => {
      const inset = index >= this.state.leftOffset &&
        index <= this.state.rightOffset;
      if (inset) {
        return <Image
          key={index}
          image={{
            ...image,
            ...scale(image.width, image.height),
          }}
          />;
      }
      return <View
        key={index}
        style={{width}}
        />;
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flexDirection: 'row'
  },
});
