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

// An array of images to load (mocking up back-end data)
const images = [
  {source: {uri: 'http://....'}, width: 100, height: 100},
  {source: require('./1.png'), width: 100, height: 100},
  {source: require('./2.png'), width: 100, height: 100},
  {source: require('./3.png'), width: 100, height: 100},
  {source: require('./4.png'), width: 100, height: 100},
  {source: require('./5.png'), width: 100, height: 100},
];

class MySlider extends Component {
  state = {images: [images[0], images[1]]};

  render() {
    const hasMoreImages = this.state.images < images.length;

    return <Slider
      images={this.state.images}
      loadMoreAfter={hasMoreImages}
      onEnd={() => {
        if (hasMoreImages) {
          this.setState({images: [
            ...this.state.images,
            images[this.state.images.length],
          ]});
        }
      }}
      />;
  }
}
```

# `images: Array<IMAGE>`

```javascript
type IMAGE = {
  [source]: number | {uri: string},
  width: number,
  height: number,
};
```

# `initial: number`

# `loadMoreAfter: boolean`

# `onEnd: () => any`
