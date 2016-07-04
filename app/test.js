/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import RN from 'react-native';
import Image from './components/ZoomImage';

export default class App extends Component {
  render() {
    return (
      <RN.View>
        <Image
          source={require('../assets/demo-images/1.jpg')}
          width={247}
          height={238}
          style={{
            marginTop: 150,
          }}
          />
      </RN.View>
    );
  }
}
