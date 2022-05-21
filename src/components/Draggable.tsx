import React, { useRef } from "react";
import {
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import PropTypes from "prop-types";

import { Children, IStyle } from "../types/Types";
import { useDNDElements } from "./DroppablesData";
import { useScrollViewRef } from "../DND-test";
import { changePosition } from "../Utilities/ButchObjUtils";
import { ButchObj } from "../Butch/ButchObj";

const ANIMATION_FRICTION = 8;
const SCROLL_START_OFFSET = 70;

interface IDraggableProps {
  children?: Children;
  style?: IStyle;
  delayLongPress?: number;
  item: ButchObj;
}

const inputRange = [0, 0.5, 0.6, 1];
const outputRange = [1, 0.97, 0.96, 1.05];
const margins = ["margin", "marginBottom", "marginTop", "marginEnd", "marginStart"];
const createMargins = (styles: IStyle = {}) => {
  const stylesMargins: IStyle = {};
  margins.forEach(margin => {
    stylesMargins[margin] = styles[margin] ?? 0;
  });

  return stylesMargins;
};

const windowSize = Dimensions.get("window");
let offsetScreen = 20;

function Draggable({ style, children, item, delayLongPress = 370 }: IDraggableProps) {
  let state = useRef({
    isAnimating: false,
    isDragging: false,
    isPicked: false,
    zIndex: 1,
  }).current;

  let isScrolling = useRef(false).current;

  const svRef = useScrollViewRef();
  const draggablesData = useDNDElements();

  const animationValue = useRef(new Animated.Value(0)).current;
  const scaleEaseIn = animationValue.interpolate({
    inputRange: inputRange,
    outputRange: outputRange,
  });

  const pan = useRef(new Animated.ValueXY()).current;
  // pan.x.

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !state.isAnimating && (state.isDragging || state.isPicked),

    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
      pan.setValue({ x: 0, y: 0 });

      state = { ...state, isDragging: true, isPicked: false };
      console.log(state);
    },

    onPanResponderMove: (_, gesture) => {
      pan.setValue({
        x: gesture.dx,
        y: gesture.dy,
      });

      // svRef?.current?.scrollToOffset({ offset: 100 });
      move(gesture.moveY);
      // setInterval();
    },

    // Maybe move code to onTouchEnd
    onPanResponderRelease: (_, gestures) => {
      isScrolling = false;
      state = { ...state, isDragging: false, isAnimating: true };
      console.log(state);
      // Animated.spring(pan, {
      //   toValue: { x: 0, y: 0 },
      //   friction: ANIMATION_FRICTION,
      //   tension: 20,
      //   useNativeDriver: true,
      // }).start(({}) => {
      //   pan.setValue({ x: 0, y: 0 });
      //   pan.flattenOffset();
      //   state = { ...state, zIndex: 1, isAnimating: false }
      //   console.log(state)
      // });

      changePosition(draggablesData, item, { x: gestures.moveX, y: gestures.moveY });
      pan.flattenOffset();
    },
  });

  const onTouchStart = (event: GestureResponderEvent) => {
    event.stopPropagation();
    Animated.spring(animationValue, {
      toValue: 1,
      friction: ANIMATION_FRICTION,
      delay: delayLongPress - 10,
      useNativeDriver: true,
    }).start();
  };

  const onLongPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    state = { ...state, zIndex: 100, isPicked: true };
  };

  const onTouchEnd = () => {
    Animated.spring(animationValue, {
      toValue: 0,
      friction: ANIMATION_FRICTION,
      useNativeDriver: true,
    }).start();
  };

  const moveList = (coords: number) => {
    if (!isScrolling) {
      return;
    }

    svRef?.current?.scrollToOffset({ offset: coords, animated: true });
    offsetScreen += 20;
    console.log(svRef === null || svRef === undefined);
    console.log("Scrolling");

    requestAnimationFrame(() => {
      setTimeout(() => moveList(coords), 10);
    });
  };

  const move = (y: number) => {
    if (y + SCROLL_START_OFFSET > windowSize.height) {
      if (!isScrolling) {
        isScrolling = true;
        moveList(y);
      }
    } else if (y < SCROLL_START_OFFSET) {
      if (!isScrolling) {
        isScrolling = true;
        moveList(y);
      }
    } else {
      isScrolling = false;
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleEaseIn }, { translateX: pan.x }, { translateY: pan.y }],
          // left: ,
          zIndex: state.zIndex,
          elevation: state.zIndex,
        },
        createMargins(style),
      ]}
      {...panResponder.panHandlers}>
      <TouchableWithoutFeedback delayLongPress={delayLongPress} onLongPress={onLongPress}>
        <View style={[style, createMargins()]} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

Draggable.propTypes = {
  children: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  delayLongPress: PropTypes.number,
};

export default Draggable;
