import React, { useRef } from "react";
import { View, Animated, PanResponder, TouchableWithoutFeedback, Dimensions } from "react-native";

import { Children, IStyle } from "../types/Types";
import useStateCallback from "../hooks/useStateCallback";
import { useScrollViewRef } from "../DND-test";
import PropTypes from "prop-types";

const ANIMATION_FRICTION = 8;
const SCROLL_START_OFFSET = 70;

interface IDraggableProps {
  children?: Children;
  style?: IStyle;
  delayLongPress?: number;
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

function Draggable({ style, children, delayLongPress = 370 }: IDraggableProps) {
  const [state, setState] = useStateCallback({
    isAnimating: false,
    isDragging: false,
    isPicked: false,
    zIndex: 1,
  });

  let isScrolling = useRef(false).current;

  const svRef = useScrollViewRef();

  const animationValue = useRef(new Animated.Value(0)).current;
  const scaleEaseIn = animationValue.interpolate({
    inputRange: inputRange,
    outputRange: outputRange,
  });

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !state.isAnimating && (state.isDragging || state.isPicked),

    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
      pan.setValue({ x: 0, y: 0 });

      setState({ ...state, isDragging: true, isPicked: false }, function () {
        console.log("Grant: ", state);
      });
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
      setState({ ...state, isDragging: false, isAnimating: true }, function () {
        console.log("Released: ", state);
      });
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: ANIMATION_FRICTION,
        tension: 20,
        useNativeDriver: true,
      }).start(({}) => {
        pan.setValue({ x: 0, y: 0 });
        pan.flattenOffset();
        setState({ ...state, zIndex: 1, isAnimating: false }, function () {
          console.log("Animated: ", state);
        });
      });
    },
  });

  const onPressIn = () => {
    Animated.spring(animationValue, {
      toValue: 1,
      friction: ANIMATION_FRICTION,
      delay: delayLongPress - 10,
      useNativeDriver: true,
    }).start();
  };

  const onLongPress = () => {
    setState({ ...state, zIndex: 100, isPicked: true }, function () {
      console.log("onLongPress: ", state);
      console.log(pan.x);
    });
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
          zIndex: state.zIndex,
          elevation: state.zIndex,
        },
        createMargins(style),
      ]}
      {...panResponder.panHandlers}>
      <TouchableWithoutFeedback delayLongPress={delayLongPress} onLongPress={onLongPress}>
        <View style={[style, createMargins()]} onTouchStart={onPressIn} onTouchEnd={onTouchEnd}>
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
