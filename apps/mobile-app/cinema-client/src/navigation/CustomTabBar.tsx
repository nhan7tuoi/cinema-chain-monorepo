import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Ticket, Film, Percent, User } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { AnimatedAppText } from '@components/AppText';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width;

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;
  
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(state.index * TAB_WIDTH, {
      duration: 250,
    });
  }, [state.index, TAB_WIDTH]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={[styles.container, { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20 }]}>
      <Animated.View style={[styles.indicatorContainer, { width: TAB_WIDTH }, indicatorStyle]}>
        <View style={styles.indicator} />
      </Animated.View>

      <View style={styles.tabContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const renderIcon = () => {
            const color = isFocused ? Colors.textActive : Colors.textInactive;
            const size = 24;
            
            if (route.name === 'Booking') {
              return (
                <View style={[
                  styles.centerButton,
                  { backgroundColor: isFocused ? Colors.primary : Colors.centerButtonInactive }
                ]}>
                  <Film color={Colors.textActive} size={32} />
                </View>
              );
            }

            switch (route.name) {
              case 'Home':
                return <Home color={color} size={size} />;
              case 'MyTickets':
                return <Ticket color={color} size={size} />;
              case 'Promotions':
                return <Percent color={color} size={size} />;
              case 'Profile':
                return <User color={color} size={size} />;
              default:
                return <Home color={color} size={size} />;
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              {renderIcon()}
              {route.name !== 'Booking' && (
                <AnimatedAppText style={[styles.tabLabel, { color: isFocused ? Colors.textActive : Colors.textInactive }]}>
                  {label as string}
                </AnimatedAppText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabContent: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    height: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    borderWidth: 5,
    borderColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default CustomTabBar;
