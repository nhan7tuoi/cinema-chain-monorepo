import React, { useState, useEffect } from 'react';
import { View, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { Home } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { StepProgress } from '../showtime/components/StepProgress';
import { paymentStyles as styles } from './styles';
import { simulatePayment } from '../booking/api';
import { generateVietQRUrl } from '@utils/payment';
import { useBookingSocket } from '@hooks/booking/useBookingSocket';

const PaymentScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { orderCode, amount = 0 } = route.params || {};
  const [timeLeft, setTimeLeft] = useState(600); 
  const [isSimulating, setIsSimulating] = useState(false);

  useBookingSocket({
    orderCode,
    onPaymentSuccess: () => {
      Alert.alert('Thành công', 'Thanh toán thành công! Vé của bạn đã được xác nhận.', [
        { 
          text: 'Xem vé', 
          onPress: () => navigation.navigate('MainTabs', { screen: 'MyTickets' }) 
        }
      ]);
    }
  });

  const qrUrl = generateVietQRUrl(amount, orderCode);

  useEffect(() => {
    if (timeLeft <= 0) {
      Alert.alert('Hết giờ', 'Giao dịch đã hết hạn thanh toán.', [
        { text: 'Đóng', onPress: () => navigation.navigate('MainTabs') }
      ]);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);



  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      await simulatePayment(orderCode);
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể giả lập thanh toán');
      setIsSimulating(false);
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

  return (
    <View style={styles.container}>
      <Body 
        showBack 
        title="QUÉT MÃ QR"
        rightComponent={renderHomeButton()}
        style={styles.container}
      >
        <StepProgress currentStep={4} />

        <View style={styles.content}>
          <AppText style={styles.instructionText}>
            Sử dụng App Ngân hàng hoặc Ví điện tử để quét mã
          </AppText>
          
          <AppText style={styles.amountText}>
            {amount.toLocaleString('vi-VN')}đ
          </AppText>

          <View style={styles.qrContainer}>
            <Image 
              source={{ uri: qrUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <AppText style={styles.instructionText}>Mã vé: {orderCode}</AppText>
          
          <AppText style={styles.countdownText}>
            Giao dịch hết hạn trong: <AppText style={styles.timeText}>{formatTime(timeLeft)}</AppText>
          </AppText>

          <AppButton 
            title="Đã thanh toán (Dev Only)"
            loading={isSimulating}
            onPress={handleSimulatePayment}
            style={{ marginTop: 40, width: '100%' }}
          />
        </View>
      </Body>
    </View>
  );
};

export default PaymentScreen;
