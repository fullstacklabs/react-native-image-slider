// @flow
import React, {Component} from 'react';
import {
  Image,
  View,
  ProgressViewIOS,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
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
  scale: Animated.Value,
};

export default class _Image extends Component {
  props: PROPS;
  state: STATE = {
    progress: 0,
    started: false,
    ended: false,
    done: false,
    scale: new Animated.Value(1),
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
    const style = {
      overflow: 'hidden',
      width: Dimensions.get('window').width,
      flex: 1,
      borderWidth: 2,
      borderColor: 'white',
      transform: [{scale: this.props.zooms[this.props.index]}],
    };
    // if (this.props.cursor === this.props.image.id) {
    //   style.transform = [{scale: this.props.zoom}];
    // } else {
    //   style.transform = [{scale: 1}];
    // }
    return (
      <Animated.View
        style={style}
        >
        <Image
          source={{uri: this.props.image.url}}
          style={{
            alignSelf: 'center',
            width: this.props.image.width,
            height: this.props.image.height,
            ...this.props.style,
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
            width: this.props.image.width * this.props.zooms[this.props.index],
            alignSelf: 'center',
          }}
          />}
      </Animated.View>
    );
  }
}
