import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Colors } from '@constants/colors';

export interface AppTextProps extends TextProps {
  children: React.ReactNode;
}

export const AppText = ({ style, children, ...props }: AppTextProps) => {
  return (
    <Text style={[styles.defaultStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export const AnimatedAppText = Animated.createAnimatedComponent(AppText);

const styles = StyleSheet.create({
  defaultStyle: {
    // fontFamily: 'YourCustomFont-Regular', // Khai báo font custom 
    color: Colors.textActive,
  },
});
  