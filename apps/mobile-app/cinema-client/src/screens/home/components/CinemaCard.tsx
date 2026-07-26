import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { cinemaCardStyles as styles } from './styles';

interface CinemaCardProps {
  item: any;
}

export const CinemaCard: React.FC<CinemaCardProps> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.cinemaCard} activeOpacity={0.7}>
      <AppText style={styles.cinemaName}>{item.name}</AppText>
      <AppText style={styles.cinemaAddress} numberOfLines={1}>{item.address}</AppText>
      <AppText style={styles.cinemaDistance}>{item.distance}</AppText>
    </TouchableOpacity>
  );
};


