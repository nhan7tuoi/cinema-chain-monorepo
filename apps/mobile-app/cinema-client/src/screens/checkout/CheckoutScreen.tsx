import React, { useMemo, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { Home, QrCode } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { StepProgress } from '../showtime/components/StepProgress';
import { styles } from './styles';
import { createBooking } from '../booking/api';

const CheckoutScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  const { 
    showtime, 
    selectedSeats = [], 
    comboQuantities = {}, 
    finalTotalPrice = 0 
  } = route.params || {};

  const [isBooking, setIsBooking] = useState(false);

  const handlePayment = async () => {
    if (!showtime?.id || selectedSeats.length === 0) return;

    setIsBooking(true);
    try {
      const payload = {
        showtimeId: showtime.id,
        seatIds: selectedSeats.map((s: any) => s.id),
        combos: Object.entries(comboQuantities).map(([comboId, quantity]) => ({
          comboId: Number(comboId),
          quantity: quantity as number
        })).filter(c => c.quantity > 0)
      };

      const booking = await createBooking(payload);
      navigation.navigate('Payment', { orderCode: booking.code, amount: Number(booking.totalAmount) });
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tạo đơn hàng');
    } finally {
      setIsBooking(false);
    }
  };

  const renderHomeButton = () => (
    <AppButton 
      type="text"
      icon={<Home color={Colors.textInactive} size={24} />}
      onPress={() => navigation.navigate('MainTabs')}
      style={styles.headerHomeButton}
    />
  );

  const totalCombosCount = useMemo(() => {
    return Object.values(comboQuantities as Record<string, number>).reduce((a, b) => a + b, 0);
  }, [comboQuantities]);

  const seatsPrice = useMemo(() => {
    return selectedSeats.reduce((sum: number, seat: any) => sum + seat.price, 0);
  }, [selectedSeats]);

  const combosPrice = finalTotalPrice - seatsPrice;

  return (
    <View style={styles.container}>
      <Body 
        showBack 
        title="THANH TOÁN"
        rightComponent={renderHomeButton()}
        style={styles.container}
      >
        <StepProgress currentStep={3} />

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          
          <View style={styles.section}>
            <AppText style={styles.movieTitle}>{showtime?.movieTitle || 'Movie Name'}</AppText>
            
            <View style={styles.row}>
              <AppText style={styles.label}>Rạp</AppText>
              <AppText style={styles.value}>{showtime?.cinema?.name || 'Cinema Name'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Suất chiếu</AppText>
              <AppText style={styles.value}>{showtime?.time || '20:00'} - {showtime?.format || '2D Phụ đề'}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Phòng chiếu</AppText>
              <AppText style={styles.value}>{showtime?.auditoriumName || 'ScreenX'}</AppText>
            </View>
          </View>

          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Thông tin đặt chỗ</AppText>
            
            <View style={styles.row}>
              <AppText style={styles.label}>Ghế ({selectedSeats.length})</AppText>
              <AppText style={styles.value}>{selectedSeats.map((s: any) => s.code || s.id).join(', ')}</AppText>
            </View>
            <View style={styles.row}>
              <AppText style={styles.label}>Tiền vé</AppText>
              <AppText style={styles.value}>{seatsPrice.toLocaleString('vi-VN')}đ</AppText>
            </View>

            {totalCombosCount > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.row}>
                  <AppText style={styles.label}>Bắp nước ({totalCombosCount})</AppText>
                  <AppText style={styles.value}>{combosPrice.toLocaleString('vi-VN')}đ</AppText>
                </View>
              </>
            )}
          </View>

          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Phương thức thanh toán</AppText>
            <View style={styles.paymentMethodRow}>
              <View style={[styles.paymentIcon, { justifyContent: 'center', alignItems: 'center' }]}>
                <QrCode color={Colors.textActive} size={20} />
              </View>
              <AppText style={styles.paymentName}>Chuyển khoản VietQR (Miễn phí)</AppText>
            </View>
          </View>

        </ScrollView>
      </Body>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <AppText style={styles.footerTotalLabel}>Thanh toán</AppText>
          <AppText style={styles.footerPriceValue}>
            {finalTotalPrice.toLocaleString('vi-VN')}đ
          </AppText>
        </View>
        <AppButton 
          title="Tạo mã QR"
          loading={isBooking}
          onPress={handlePayment}
          style={{ paddingHorizontal: 24 }}
        />
      </View>
    </View>
  );
};

export default CheckoutScreen;
