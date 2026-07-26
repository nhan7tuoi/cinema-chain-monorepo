import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/AppText';
import { ticketStyles as styles } from './styles';

const TicketScreen = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>TicketScreen</AppText>
    </View>
  );
};



export default TicketScreen;