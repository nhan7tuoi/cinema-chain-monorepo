import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@constants/colors';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 1.5;

export const splashStyles = StyleSheet.create({
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

