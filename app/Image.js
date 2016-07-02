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
    console.log(this.props.zoom);
    return (
      <View
        style={{
          overflow: 'hidden',
          width: Dimensions.get('window').width,
          flex: 1,
        }}
        >
        <Animated.Image
          {...PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderRelease: () => {
              console.log('release');
            },
            // onPanResponderTerminate: release,
            onPanResponderMove: (event) => {
              const {nativeEvent} = event;
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('===============================');
              console.log('moving', nativeEvent);
              if (nativeEvent.changedTouches.length === 2) {
                Animated.timing(this.state.scale, {
                  toValue: 1.75,
                  duration: 0,
                }).start();
              } else {
                // this.state.scale.setValue(1.5);
              }
              // this.state.scale.setValue(1.25);
              // Animated
              //   .timing(this.state.scale, {
              //     toValue: 1.5,
              //     duration: -15,
              //   })
              //   .start();
            },
          }).panHandlers}
          source={{uri: this.props.image.url}}
          style={{
            alignSelf: 'center',
            width: this.props.image.width * this.props.zoom,
            height: this.props.image.height * this.props.zoom,
            transform: [{scale: this.state.scale}],
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
      </View>
    );
  }
}
