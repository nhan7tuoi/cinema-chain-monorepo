import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/AppText';

const TicketScreen = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>TicketScreen</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TicketScreen;