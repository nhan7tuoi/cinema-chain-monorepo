import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { Clock, MapPin, CalendarDays } from 'lucide-react-native';
import { ticketCardStyles as styles } from './styles';

interface TicketCardProps {
  booking: any;
  onPress?: () => void;
}

export const TicketCard = ({ booking, onPress }: TicketCardProps) => {
  const { showtime } = booking;
  const movie = showtime?.movie;
  const branch = showtime?.branch;

  const startsAt = showtime?.startsAt ? new Date(showtime.startsAt) : null;
  const date = startsAt ? startsAt.toLocaleDateString('vi-VN') : '';
  const time = startsAt ? startsAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.topSection}>
        <Image 
          source={{ uri: movie?.posterUrl || 'https://via.placeholder.com/150' }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <AppText style={styles.movieTitle} numberOfLines={2}>{movie?.title}</AppText>
          
          <View style={styles.row}>
            <CalendarDays color={Colors.textInactive} size={14} />
            <AppText style={styles.infoText}>{date}</AppText>
          </View>
          
          <View style={styles.row}>
            <Clock color={Colors.textInactive} size={14} />
            <AppText style={styles.infoText}>{time} • {movie?.format || '2D'}</AppText>
          </View>
          
          <View style={styles.row}>
            <MapPin color={Colors.textInactive} size={14} />
            <AppText style={styles.infoText} numberOfLines={1}>{branch?.name}</AppText>
          </View>

          <View style={styles.statusBadge}>
            <AppText style={styles.orderStatus}>
              {booking.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};


