import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import SplashScreen from '../screens/splash/SplashScreen';
import MovieDetailScreen from '../screens/movieDetail/MovieDetailScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuth } from '@hooks/useAuth';
import { RootStackParamList } from './types';

import ShowtimeScreen from '../screens/showtime/ShowtimeScreen';
import SeatSelectionScreen from '../screens/seatSelection/SeatSelectionScreen';
import ComboSelectionScreen from '../screens/comboSelection/ComboSelectionScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import PaymentScreen from '../screens/checkout/PaymentScreen';
import TicketDetailScreen from '../screens/tickets/TicketDetailScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // Call useAuth here so that initAuth is triggered when the app starts
  useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="Showtime" component={ShowtimeScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="ComboSelection" component={ComboSelectionScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
