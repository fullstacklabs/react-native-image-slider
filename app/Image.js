// @flow
import React, {Component} from 'react';
import {
  Image,
  ScrollView,
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
    console.log(this.props.zoom);
    return (
      <ScrollView
        style={{
          overflow: 'hidden',
          width: Dimensions.get('window').width,
          flex: 1,
        }}
        minimumZoomScale={1}
        maximumZoomScale={4}
        zoomScale={1}
        centerContent={true}
        >
        <Image
          pointerEvents="none"
          source={{uri: this.props.image.url}}
          style={{
            alignSelf: 'center',
            width: this.props.image.width * this.props.zoom,
            height: this.props.image.height * this.props.zoom,
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
            width: this.props.image.width * this.props.zoom,
            alignSelf: 'center',
          }}
          />}
      </ScrollView>
    );
  }
}
