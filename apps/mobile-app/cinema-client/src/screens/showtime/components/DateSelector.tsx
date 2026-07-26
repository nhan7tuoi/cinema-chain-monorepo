import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { dateSelectorStyles as styles } from './styles';

dayjs.locale('vi');

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const DateSelector = ({ selectedDate, onSelectDate }: DateSelectorProps) => {
  // Generate next 14 days
  const dates = Array.from({ length: 14 }).map((_, i) => dayjs().add(i, 'day'));
  
  const formattedSelectedDate = dayjs(selectedDate).format('dddd, DD/MM/YYYY');
  const capitalizedDate = formattedSelectedDate.charAt(0).toUpperCase() + formattedSelectedDate.slice(1);

  return (
    <View style={styles.container}>
      <AppText style={styles.headerTitle}>{capitalizedDate}</AppText>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date, index) => {
          const isSelected = date.isSame(selectedDate, 'day');
          const isToday = index === 0;
          
          return (
            <TouchableOpacity
              key={date.format('YYYY-MM-DD')}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
              ]}
              onPress={() => onSelectDate(date.toDate())}
            >
              <AppText style={[
                styles.dayText,
                isSelected && styles.textSelected
              ]}>
                {isToday ? 'H.nay' : date.format('Tdd').replace('T', 'T')}
              </AppText>
              <AppText style={[
                styles.dateText,
                isSelected && styles.textSelected
              ]}>
                {date.format('D')}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};


