// @flow
import React, {Component} from 'react';
import {Image, View, ProgressViewIOS, Animated, Easing, Dimensions} from 'react-native';
// import scale from './scale';
import type {IMAGE} from './ImageSlider';

export
type PROPS = {
  image: IMAGE,
  style?: Object,
  onZoom?: Function,
  zoom: Animated.Value,
};

export
type STATE = {
  progress: number,
  started: boolean,
  ended: boolean,
  done: boolean,
};

export default class _Image extends Component {
  props: PROPS;
  state: STATE = {
    progress: 0,
    started: false,
    ended: false,
    done: false,
  };
  componentDidUpdate() {
  }
  isStarting() {
    this.setState({progress: 0.1, started: true});
  }
  isEnding() {
    if (!this.state.done) {
      this.setState({ended: false});
    } else {
      this.setState({progress: 1, ended: true});
    }
  }
  isDone() {
    this.setState({progress: 0.9, done: true});
  }
  render() {
    return (
      <View style={{overflow: 'hidden', width: Dimensions.get('window').width}}>
        <Animated.Image
          source={{uri: this.props.image.url}}
          style={{
            width: this.props.image.width,
            height: this.props.image.height,
            ...this.props.style,
            opacity: this.props.zoom,
            transform: [
              {
                scale: this.props.zoom,
              }
            ]
          }}
          onLoadStart={() => {
            this.isStarting();
          }}
          onLoadEnd={() => {
            this.isEnding();
          }}
          onLoad={() => {
            this.isDone();
          }}
          />
        {!this.state.ended && <ProgressViewIOS
          progress={this.state.progress}
          style={{
            position: 'absolute',
            marginTop: -2,
            width: this.props.image.width,
          }}
          />}
      </View>
    );
  }
}
