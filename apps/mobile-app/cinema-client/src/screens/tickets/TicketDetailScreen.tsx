import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { Colors } from '@constants/colors';
import { Clock, MapPin, CalendarDays, Ticket } from 'lucide-react-native';
import { ticketDetailStyles as styles } from './styles';

const { width } = Dimensions.get('window');

const TicketDetailScreen = () => {
  const route = useRoute<any>();
  const { booking } = route.params || {};

  if (!booking) return null;

  const { showtime, tickets } = booking;
  const movie = showtime?.movie;
  const branch = showtime?.branch;
  const auditorium = showtime?.auditorium;
  const seatNames = tickets?.map((t: any) => t.seat?.code).filter(Boolean).join(', ');
  const comboText = booking.bookingCombos?.map((bc: any) => `${bc.quantity}x ${bc.combo?.name}`).filter(Boolean).join(', ');
  const startsAt = showtime?.startsAt ? new Date(showtime.startsAt) : null;
  const date = startsAt ? startsAt.toLocaleDateString('vi-VN') : '';
  const time = startsAt ? startsAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor="#4a0000" stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <Body 
        title="CHI TIẾT VÉ" 
        style={styles.content} 
        containerStyle={{ backgroundColor: 'transparent' }}
        showBack
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
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
            </View>
          </View>

          <View style={styles.dividerContainer}>
            <View style={[styles.cutout, styles.leftCutout]} />
            <View style={styles.dottedLine} />
            <View style={[styles.cutout, styles.rightCutout]} />
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.detailsRow}>
              <View style={styles.detailBlock}>
                <AppText style={styles.detailLabel}>Phòng chiếu</AppText>
                <AppText style={styles.detailValue}>{auditorium?.name}</AppText>
              </View>
              <View style={styles.detailBlock}>
                <AppText style={styles.detailLabel}>Ghế</AppText>
                <AppText style={styles.detailValue}>{seatNames || 'N/A'}</AppText>
              </View>
            </View>

            {comboText ? (
              <View style={[styles.detailsRow, { marginTop: -10 }]}>
                <View style={styles.detailBlock}>
                  <AppText style={styles.detailLabel}>Bắp nước</AppText>
                  <AppText numberOfLines={2} style={[styles.detailValue, { textAlign: 'center', fontSize: 16 }]}>{comboText}</AppText>
                </View>
              </View>
            ) : null}

            <View style={styles.qrContainer}>
              <View style={[styles.qrPlaceholder, { backgroundColor: '#fff', padding: 8, overflow: 'hidden' }]}>
                <Image 
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.code}` }} 
                  style={{ width: 134, height: 134 }} 
                />
              </View>
              <AppText style={styles.orderCode}>Mã Đơn Hàng: {booking.code}</AppText>
              <AppText style={styles.orderStatus}>
                {booking.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
              </AppText>
            </View>
            
            <AppText style={styles.noteText}>
              Vui lòng đưa mã QR này cho nhân viên để được hỗ trợ vào phòng chiếu hoặc lấy bắp nước.
            </AppText>
          </View>
        </View>

      </ScrollView>
    </Body>
    </View>
  );
};



export default TicketDetailScreen;
