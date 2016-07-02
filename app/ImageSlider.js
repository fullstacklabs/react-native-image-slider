// @flow
import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';
import Image from './Image';
import scale from './lib/scale';
import panHandler from './lib/panHandler';
import calculateCardinals from './lib/calculateCardinals';
import applyZoom from './lib/zoom';

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
  _zoom: number,
  zoom: Animated.Value,
  size: number,
  leftBoundary: number,
  rightBoundary: number,
  limit: number,
};

export
type STATE = CARDINALS;

export default class ImageSlider extends Component {
  props: PROPS;
  state: STATE = {
    ...calculateCardinals(this.props),
    zooming: false,
    scale: new Animated.Value(1),
  };
  componentDidUpdate() {
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
    console.log('...');
  }
  onChange: Function = (cardinals: CARDINALS) => {
    const {left, cursor, zoom} = cardinals;
    const _width = Dimensions.get('window').width;
    // this.setState({left}, () => {
    Animated.spring(left, {
      toValue: cursor * -_width,
      friction: 10,
      tension: 50,
    }).start();
    // Animated.spring(zoom, {
    //   toValue: cursor * -_width,
    //   friction: 10,
    //   tension: 50,
    // }).start();
    // });
    // this.setState({zoom});
  };
  onZoom: Function = (cardinals: CARDINALS) => {
    console.log('---------------------------');
    // const {zoom, _zoom} = cardinals;
    // Animated
    //   .spring(zoom, {
    //     toValue: _zoom,
    //     velocity: 10,
    //     duration: 10,
    //     easing: Easing.linear,
    //   })
    //   .start();
    this.setState({zooming: true});
  };
  render() {
    const {height, width} = Dimensions.get('window');
    return (
      <View style={{
        flexDirection: 'column',
      }}>
        <Animated.View
          {...panHandler(
            this.state,
            {onChange: this.onChange, onZoom: this.onZoom}
          )}
          style={[
            {
              backgroundColor: 'black',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              transform: [
                {translateX: this.state.left},
              ],
              height,
              width: width * (this.state.rightOffset - this.state.leftOffset)
            },
          ]}
          >
          {this.renderImages()}
        </Animated.View>
      </View>
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
          zoom={this.state._zoom}
          onZoom={() => {
            console.log('hello');
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
