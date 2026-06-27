import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppText } from '@components/AppText';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = 150;
const MAX_SCALE = Math.ceil(Math.sqrt(width * width + height * height) / (CIRCLE_SIZE / 2));

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0);
  const circleOpacity = useSharedValue(0);

  const navigateToMain = () => {
    navigation.replace('MainTabs');
  };

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });

    circleOpacity.value = withDelay(1300, withTiming(1, { duration: 300 }));

    scaleAnim.value = withDelay(
      1600,
      withTiming(MAX_SCALE, { duration: 1500 }, (finished) => {
        if (finished) {
          setTimeout(() => {
            runOnJS(navigateToMain)();
          }, 400);
        }
      })
    );
  }, []);

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: circleOpacity.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circleContainer, circleAnimatedStyle]}>
        <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#4A4A4A" stopOpacity="0.8" />
              <Stop offset="50%" stopColor="#2C2C2E" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#1a1a1a" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_SIZE / 2}
            fill="url(#grad)"
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <AppText style={styles.title}>
          <AppText style={styles.titleWhite}>Cin</AppText>
          <AppText style={styles.titleRed}>ema</AppText>
        </AppText>
        <AppText style={styles.subtitle}>Xem để đú</AppText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  titleWhite: {
    color: '#E5E5EA',
  },
  titleRed: {
    color: '#D21E27',
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
});

export default SplashScreen;
