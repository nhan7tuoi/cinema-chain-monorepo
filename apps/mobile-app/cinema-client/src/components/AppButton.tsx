import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { AppText } from './AppText';
import { Colors } from '@constants/colors';

export interface AppButtonProps extends TouchableOpacityProps {
  title?: string;
  loading?: boolean;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const AppButton = ({
  title,
  loading = false,
  type = 'primary',
  style,
  textStyle,
  icon,
  disabled,
  ...props
}: AppButtonProps) => {
  const getContainerStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'text':
        return styles.textContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'outline':
      case 'text':
        return styles.outlineText;
      case 'secondary':
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getContainerStyle(),
        (disabled || loading) && styles.disabledContainer,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' || type === 'text' ? Colors.primary : '#FFF'} />
      ) : (
        <>
          {icon}
          {title ? (
            <AppText style={[styles.text, getTextStyle(), textStyle, icon ? { marginLeft: 8 } : null]}>
              {title}
            </AppText>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryContainer: {
    backgroundColor: Colors.primary,
  },
  secondaryContainer: {
    backgroundColor: Colors.centerButtonInactive,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Colors.primary,
  },
});
