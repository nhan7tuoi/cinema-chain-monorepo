import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { MapPin } from 'lucide-react-native';
import { CinemaCard, Cinema } from './CinemaCard';
import { cinemaListStyles as styles } from './styles';

interface CinemaListProps {
  cinemas: Cinema[];
  selectedShowtimeId?: number;
  onSelectShowtime: (cinema: Cinema, format: string, showtime: any) => void;
  location?: string;
}

export const CinemaList = ({ 
  cinemas, 
  selectedShowtimeId, 
  onSelectShowtime,
  location = 'Hồ Chí Minh'
}: CinemaListProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Rạp gần bạn({cinemas.length})</AppText>
        <TouchableOpacity style={styles.locationBtn}>
          <MapPin size={14} color={Colors.textInactive} />
          <AppText style={styles.locationText}>{location}</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {cinemas.map(cinema => (
          <CinemaCard 
            key={cinema.id} 
            cinema={cinema} 
            selectedShowtimeId={selectedShowtimeId}
            onSelectShowtime={onSelectShowtime}
          />
        ))}
      </View>
    </View>
  );
};


