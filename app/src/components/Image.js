// @flow
import React, {Component} from 'react';
import {Image, Animated} from 'react-native';

type PROPS = {
  onLoading?: Function,
  onLoaded?: Function,
  onFail?: Function,
};
type STATE = {
  done: boolean;
};

export default class _Image extends Component {
  props: PROPS;
  state: STATE = {done: false};
  render() {
    return (
      <Animated.Image
        {...this.props}
        onLoadStart={() => {
          if (typeof this.props.onLoading === 'function') {
            this.props.onLoading();
          }
        }}
        onLoadEnd={() => {
          if (this.state.done) {
            if (typeof this.props.onLoaded === 'function') {
              this.props.onLoaded();
            }
          } else if (typeof this.props.onFail === 'function') {
            this.props.onFail();
          }
        }}
        onLoad={() => {
          this.setState({done: true});
        }}
        />
    );
  }
}
