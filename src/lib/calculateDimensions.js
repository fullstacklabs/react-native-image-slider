// @flow
// A function to resize images so they fit onto screen
import {Dimensions} from 'react-native';
export
type SCALE = {
  width: number,
  height: number,
};

export default function calculateDimensions(
  srcWidth: number, srcHeight: number): SCALE {
  const {width, height} = Dimensions.get('window');
  let ratio = [width / srcWidth, (height) / srcHeight];
  ratio = Math.min(ratio[0], ratio[1]);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  };
}
