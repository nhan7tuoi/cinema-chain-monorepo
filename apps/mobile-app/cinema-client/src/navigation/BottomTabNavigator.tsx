import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/home/HomeScreen';
import MyTicketsScreen from '@screens/tickets/MyTicketsScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import BookingScreen from '@screens/booking/BookingScreen';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="MyTickets" component={MyTicketsScreen} options={{ tabBarLabel: 'My Tickets' }} />
      <Tab.Screen name="Booking" component={BookingScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name="Promotions" component={HomeScreen} options={{ tabBarLabel: 'Khuyến mãi' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Tài khoản' }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
