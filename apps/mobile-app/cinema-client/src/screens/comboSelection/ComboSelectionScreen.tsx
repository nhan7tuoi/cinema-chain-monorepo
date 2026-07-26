import React, { useState, useMemo } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { Home } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { StepProgress } from '../showtime/components/StepProgress';
import { ComboItem } from './components/ComboItem';
import { styles } from './styles';
import { getCombos } from '../booking/api';

const ComboSelectionScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  const { data: combosList = [], isLoading: isLoadingCombos } = useQuery({
    queryKey: ['combos'],
    queryFn: getCombos,
  });
  
  const { showtime, selectedSeats = [] } = route.params || {};

  const [comboQuantities, setComboQuantities] = useState<Record<string, number>>({});

  const handleIncrease = (comboId: number) => {
    setComboQuantities(prev => ({
      ...prev,
      [comboId]: (prev[comboId] || 0) + 1,
    }));
  };

  const handleDecrease = (comboId: number) => {
    setComboQuantities(prev => {
      const current = prev[comboId] || 0;
      if (current <= 0) return prev;
      return {
        ...prev,
        [comboId]: current - 1,
      };
    });
  };

  const seatsTotalPrice = useMemo(() => {
    return selectedSeats.reduce((sum: number, seat: any) => sum + seat.price, 0);
  }, [selectedSeats]);

  const combosTotalPrice = useMemo(() => {
    return combosList.reduce((sum: number, combo: any) => {
      const qty = comboQuantities[combo.id] || 0;
      return sum + (Number(combo.price) * qty);
    }, 0);
  }, [comboQuantities, combosList]);

  const finalTotalPrice = seatsTotalPrice + combosTotalPrice;

  const handleContinue = () => {
    navigation.navigate('Checkout', { showtime, selectedSeats, comboQuantities, finalTotalPrice });
  };

  const renderHomeButton = () => (
    <AppButton 
      type="text"
      icon={<Home color={Colors.textInactive} size={24} />}
      onPress={() => navigation.navigate('MainTabs')}
      style={styles.headerHomeButton}
    />
  );

  const title = showtime?.movieTitle?.toUpperCase() || 'CHỌN BẮP NƯỚC';

  return (
    <View style={styles.container}>
      <Body 
        showBack 
        title={title} 
        rightComponent={renderHomeButton()}
        style={styles.container}
      >
        <StepProgress currentStep={2} />
        
        <View style={styles.showtimeInfo}>
          <AppText style={styles.cinemaName}>{showtime?.cinema?.name || 'Cinema Name'}</AppText>
          <AppText style={styles.timeInfo}>
            {showtime?.format || '2D Phụ đề'} - {showtime?.time || '20:00'}
          </AppText>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <AppText style={styles.sectionTitle}>Món ăn vặt & Thức uống</AppText>
          
          {isLoadingCombos ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
          ) : (
            combosList.map((combo: any) => (
              <ComboItem 
                key={combo.id}
                combo={{ ...combo, price: Number(combo.price) }}
                quantity={comboQuantities[combo.id] || 0}
                onIncrease={() => handleIncrease(combo.id)}
                onDecrease={() => handleDecrease(combo.id)}
              />
            ))
          )}
        </ScrollView>
      </Body>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <AppText style={styles.footerTotalLabel}>Tổng cộng</AppText>
          <AppText style={styles.footerPriceValue}>
            {finalTotalPrice.toLocaleString('vi-VN')}đ
          </AppText>
          <AppText style={styles.selectedSummary} numberOfLines={1}>
            {selectedSeats.length} vé, {Object.values(comboQuantities).reduce((a, b) => a + b, 0)} bắp nước
          </AppText>
        </View>
        <AppButton 
          title="Thanh toán"
          onPress={handleContinue}
          style={{ paddingHorizontal: 24 }}
        />
      </View>
    </View>
  );
};

export default ComboSelectionScreen;
