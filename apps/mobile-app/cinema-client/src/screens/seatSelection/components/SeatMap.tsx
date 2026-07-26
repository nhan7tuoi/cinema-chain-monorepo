import React from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { seatMapStyles as styles } from './styles';

export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatStatus = 'available' | 'booked';

export interface SeatInfo {
  id: number;
  code?: string;
  row: string;
  col: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

interface SeatMapProps {
  seats: SeatInfo[];
  selectedSeatIds: number[];
  onSeatPress: (seat: SeatInfo) => void;
}


export const SeatMap = ({ seats, selectedSeatIds, onSeatPress }: SeatMapProps) => {
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatInfo[]>);

  const rowKeys = Object.keys(rows).sort();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.mapContainer}>
        <View style={styles.screenWrapper}>
          <View style={styles.screenCurve} />
          <AppText style={styles.screenText}>MÀN HÌNH</AppText>
        </View>

        <View style={styles.seatsGrid}>
          {rowKeys.map(rowKey => (
            <View key={rowKey} style={styles.row}>
              <View style={styles.rowLabelContainer}>
                <AppText style={styles.rowLabel}>{rowKey}</AppText>
              </View>

              <View style={styles.seatRow}>
                {rows[rowKey].sort((a, b) => a.col - b.col).map(seat => {
                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isCouple = seat.type === 'couple';
                  
                  let backgroundColor = '#2A2A2A';
                  let borderColor = '#444';
                  
                  if (seat.type === 'vip') {
                    backgroundColor = '#4A3B1B';
                    borderColor = '#F5B041';
                  } else if (seat.type === 'couple') {
                    backgroundColor = '#4A1B3B';
                    borderColor = '#E74C3C';
                  }

                  if (seat.status === 'booked') {
                    backgroundColor = '#1C1C1C';
                    borderColor = '#333';
                  } else if (isSelected) {
                    backgroundColor = Colors.primary;
                    borderColor = Colors.primary;
                  }

                  return (
                    <TouchableOpacity
                      key={seat.id}
                      style={[
                        styles.seat,
                        isCouple && styles.seatCouple,
                        { backgroundColor, borderColor }
                      ]}
                      onPress={() => onSeatPress(seat)}
                      activeOpacity={0.7}
                    >
                      <AppText style={[
                        styles.seatNumber,
                        (seat.status === 'booked') && { color: '#444' },
                        isSelected && { color: '#FFF' }
                      ]}>
                        {seat.status === 'booked' ? 'X' : seat.col}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <View style={styles.rowLabelContainer}>
                <AppText style={styles.rowLabel}>{rowKey}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
