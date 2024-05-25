import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;

export function useSwipe(onSwipeLeft?: any, onSwipeRight?: any, onSwipeUp?: any, onSwipeDown?: any, rangeOffset = 4) {
  let firstTouchX = 0;
  let firstTouchY = 0;

  // set user touch start position
  function onTouchStart(e: any) {
    firstTouchX = e.nativeEvent.pageX;
    firstTouchY = e.nativeEvent.pageY;
  }

  function onTouchEnd(e: any) {
    const positionX = e.nativeEvent.pageX;
    const range = windowWidth / rangeOffset;
    if (positionX - firstTouchX > range) onSwipeRight && onSwipeRight();
    else if (firstTouchX - positionX > range) onSwipeLeft && onSwipeLeft();

    const positionY = e.nativeEvent.pageY;
    const rangeY = windowWidth / rangeOffset;
    if (positionY - firstTouchY > rangeY) onSwipeDown && onSwipeDown();
    else if (firstTouchY - positionY > rangeY) onSwipeUp && onSwipeUp();
  }

  return { onTouchStart, onTouchEnd };
}
