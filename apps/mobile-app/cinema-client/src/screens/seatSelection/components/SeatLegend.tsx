import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { seatLegendStyles as styles } from './styles';

export const SeatLegend = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <LegendItem color="#2A2A2A" borderColor="#444" label="Thường" />
        <LegendItem color="#4A3B1B" borderColor="#F5B041" label="VIP" />
        <LegendItem color="#4A1B3B" borderColor="#E74C3C" label="Couple" isCouple />
      </View>
      <View style={styles.row}>
        <LegendItem color={Colors.primary} borderColor={Colors.primary} label="Đang chọn" />
        <LegendItem color="#1C1C1C" borderColor="#333" label="Đã bán" hasCross />
      </View>
    </View>
  );
};

const LegendItem = ({ 
  color, 
  borderColor, 
  label, 
  isCouple = false,
  hasCross = false,
}: { 
  color: string; 
  borderColor: string; 
  label: string; 
  isCouple?: boolean;
  hasCross?: boolean;
}) => (
  <View style={styles.item}>
    <View style={[
      styles.box, 
      { backgroundColor: color, borderColor },
      isCouple && styles.boxCouple
    ]}>
      {hasCross && <AppText style={styles.crossText}>X</AppText>}
    </View>
    <AppText style={styles.label}>{label}</AppText>
  </View>
);


