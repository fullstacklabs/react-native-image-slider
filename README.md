react-native-image-slider
===

An image slider for React-Native with easy and eager loading and pinch zoom control.

# Install

```bash
npm install --save fullstacklabs/react-native-image-slider
```

# Usage

```javascript
import React, {Component} from 'react';
import Slider from 'react-native-image-slider';

class MySlider extends Component {
  state = {
    images: [
      {source: {uri: 'http://....'}, width: 100, height: 100},
      {source: require('./1.png'), width: 100, height: 100},
      // ...
    ]
  };
  render() {
    return <Slider
      images={this.state.images}
      initial={1}
      loadMoreAfter={true}
      onEnd={() => this.loadMore()}
      />;
  }
}
```
