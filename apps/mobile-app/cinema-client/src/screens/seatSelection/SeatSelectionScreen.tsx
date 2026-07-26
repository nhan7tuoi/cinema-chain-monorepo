import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { Home } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { StepProgress } from '../showtime/components/StepProgress';
import { SeatMap, SeatLegend } from './components';
import type { SeatInfo, SeatType } from './components/SeatMap';
import { useQuery } from '@tanstack/react-query';
import { getShowtimeDetails } from '../showtime/api';
import { styles } from './styles';
import { useSeatBookingSocket } from './hooks/useSeatBookingSocket';
import { useAuth } from '@hooks/useAuth';

const SeatSelectionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { showtime } = route.params || {};

  const { data: showtimeDetails, isLoading } = useQuery({
    queryKey: ['showtimeDetails', showtime?.id],
    queryFn: () => getShowtimeDetails(showtime?.id),
    enabled: !!showtime?.id,
  });

  const { user, accessToken } = useAuth();
  const userId = user?.id as unknown as number;
  
  const { selectedSeatIds, heldByOthers, soldSeats, toggleSeat } = useSeatBookingSocket({
    showtimeId: showtime?.id,
    userId,
    token: accessToken || undefined,
  });

  const seats = useMemo((): SeatInfo[] => {
    if (!showtimeDetails?.auditorium?.seats) return [];
    
    return showtimeDetails.auditorium.seats.map((s: any) => {
      let type: SeatType = 'standard';
      if (s.type === 'VIP') type = 'vip';
      if (s.type === 'COUPLE') type = 'couple';

      let status: 'available' | 'booked' = 'available';
      if (
        s.status !== 'ACTIVE' || 
        heldByOthers.includes(s.id) || 
        soldSeats.includes(s.id) || 
        showtimeDetails?.soldSeatIds?.includes(s.id)
      ) {
        status = 'booked';
      }

      return {
        id: s.id,
        code: s.code,
        row: s.rowLabel,
        col: s.number,
        type,
        status,
        price: type === 'vip' ? 120000 : type === 'couple' ? 250000 : 90000,
      };
    });
  }, [showtimeDetails, heldByOthers, soldSeats]);

  const handleSeatPress = (seat: SeatInfo) => {
    if (seat.status === 'booked') return;
    toggleSeat(seat.id);
  };

  const selectedSeats = useMemo(() => {
    return seats.filter(s => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }, [selectedSeats]);

  const handleContinue = () => {
    if (selectedSeatIds.length === 0) return;
    navigation.navigate('ComboSelection', { selectedSeats, showtime });
  };

  const renderHomeButton = () => (
    <AppButton 
      type="text"
      icon={<Home color={Colors.textInactive} size={24} />}
      onPress={() => navigation.navigate('MainTabs')}
      style={styles.headerHomeButton}
    />
  );

  const title = showtime?.movieTitle?.toUpperCase() || 'CHỌN GHẾ';

  return (
    <View style={styles.container}>
      <Body 
        showBack 
        title={title} 
        rightComponent={renderHomeButton()}
        style={styles.container}
      >
        <StepProgress currentStep={1} />
        
        <View style={styles.showtimeInfo}>
          <AppText style={styles.cinemaName}>{showtime?.cinema?.name || 'Cinema Name'}</AppText>
          <AppText style={styles.timeInfo}>
            {showtime?.format || '2D Phụ đề'} - {showtime?.time || '20:00'}
          </AppText>
        </View>

        {isLoading ? (
          <AppText style={{ textAlign: 'center', marginTop: 32, color: Colors.textInactive }}>Đang tải sơ đồ ghế...</AppText>
        ) : (
          <SeatMap 
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSeatPress={handleSeatPress}
          />
        )}

        <SeatLegend />

      </Body>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          {selectedSeats.length > 0 ? (
            <View>
              <AppText style={styles.selectedSeatsText} numberOfLines={1}>
                {selectedSeats.map(s => s.code || s.id).join(', ')}
              </AppText>
              <AppText style={styles.footerPriceValue}>
                {totalPrice.toLocaleString('vi-VN')}đ
              </AppText>
            </View>
          ) : (
            <View>
              <AppText style={styles.footerPriceLabel}>Tạm tính</AppText>
              <AppText style={styles.footerPriceValue}>0đ</AppText>
            </View>
          )}
        </View>
        <AppButton 
          title="Tiếp tục"
          disabled={selectedSeatIds.length === 0}
          onPress={handleContinue}
          style={selectedSeatIds.length === 0 ? { backgroundColor: '#333' } : { paddingHorizontal: 32 }}
          textStyle={selectedSeatIds.length === 0 ? { color: '#666' } : undefined}
        />
      </View>
    </View>
  );
};

export default SeatSelectionScreen;
