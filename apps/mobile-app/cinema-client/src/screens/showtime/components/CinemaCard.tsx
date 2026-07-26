import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react-native';
import { cinemaCardStyles as styles } from './styles';

interface Showtime {
  id: number;
  time: string;
}

interface CinemaFormat {
  format: string; // 2D, 3D
  showtimes: Showtime[];
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  distance: number; // in km
  formats: CinemaFormat[];
}

interface CinemaCardProps {
  cinema: Cinema;
  selectedShowtimeId?: number;
  onSelectShowtime: (cinema: Cinema, format: string, showtime: Showtime) => void;
}

export const CinemaCard = ({ cinema, selectedShowtimeId, onSelectShowtime }: CinemaCardProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerTop}>
          <AppText style={styles.cinemaName}>{cinema.name}</AppText>
          <View style={styles.distanceBadge}>
            <AppText style={styles.distanceText}>{cinema.distance} km</AppText>
          </View>
        </View>
        <AppText style={styles.address} numberOfLines={2}>{cinema.address}</AppText>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.directionBtn}>
            <MapPin size={14} color={Colors.textInactive} />
            <AppText style={styles.directionText}>Tìm đường</AppText>
          </TouchableOpacity>
          {expanded ? <ChevronUp size={20} color={Colors.textInactive} /> : <ChevronDown size={20} color={Colors.textInactive} />}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.formatsContainer}>
          {cinema.formats.map((format, idx) => (
            <View key={idx} style={styles.formatGroup}>
              <View style={styles.formatHeader}>
                <View style={styles.formatIndicator} />
                <AppText style={styles.formatTitle}>{format.format}</AppText>
              </View>
              
              <View style={styles.showtimeGrid}>
                {format.showtimes.map((st) => {
                  const isSelected = selectedShowtimeId === st.id;
                  return (
                    <TouchableOpacity
                      key={st.id}
                      style={[
                        styles.showtimeBtn,
                        isSelected && styles.showtimeBtnSelected
                      ]}
                      onPress={() => onSelectShowtime(cinema, format.format, st)}
                    >
                      <AppText style={[
                        styles.showtimeText,
                        isSelected && styles.showtimeTextSelected
                      ]}>
                        {st.time}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};


