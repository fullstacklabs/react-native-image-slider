export default (nativeEvent): number => {
  const left: number = nativeEvent.changedTouches[0];
  const right: number = nativeEvent.changedTouches[1];
  const abstractLeft: number = left.pageX + left.pageY;
  const abstractRight: number = right.pageX + right.pageY;
  return Math.abs(abstractRight - abstractLeft);
};
