import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'small' | 'large' | number;
  color?: string;
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  size = 'large',
  color = Colors.primary,
  overlay = false,
  style,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const getDimension = () => {
    if (typeof size === 'number') return size;
    return size === 'large' ? 40 : 24;
  };

  const dimension = getDimension();
  const strokeWidth = typeof size === 'number' ? Math.max(2, size / 10) : size === 'large' ? 4 : 3;

  const renderLoader = () => {
    return (
      <Animated.View
        style={[
          styles.customSpinner,
          {
            width: dimension,
            height: dimension,
            borderColor: color + '30', // 18% opacity for track
            borderTopColor: color, // Solid color for the spinning part
            borderWidth: strokeWidth,
          },
          animatedStyle,
        ]}
      />
    );
  };

  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    overlay && styles.overlay,
    style,
  ];

  return <View style={containerStyle}>{renderLoader()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fullScreen: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
  },
  customSpinner: {
    borderRadius: 999,
  },
});
