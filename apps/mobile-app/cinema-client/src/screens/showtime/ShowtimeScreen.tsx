import React, { useState } from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { Home } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { styles } from './styles';
import { StepProgress, DateSelector, CinemaList, Cinema } from './components';

import { useQuery } from '@tanstack/react-query';
import { getShowtimesByMovie } from './api';

const ShowtimeScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { movieId, movieTitle } = route.params;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);

  const { data: cinemas, isLoading } = useQuery({
    queryKey: ['showtimes', movieId, selectedDate],
    queryFn: () => getShowtimesByMovie(movieId, selectedDate),
  });

  const handleSelectShowtime = (cinema: Cinema, format: string, showtime: any) => {
    setSelectedShowtime({
      cinema,
      format,
      showtime
    });
  };

  const handleContinue = () => {
    if (!selectedShowtime) return;
    navigation.navigate('SeatSelection', { 
      showtime: {
        movieTitle,
        cinema: selectedShowtime.cinema,
        format: selectedShowtime.format,
        time: selectedShowtime.showtime.startTime,
        id: selectedShowtime.showtime.id
      } 
    });
  };

  const renderHomeButton = () => (
    <AppButton 
      type="text"
      icon={<Home color={Colors.textInactive} size={24} />}
      onPress={() => navigation.navigate('MainTabs')}
      style={styles.headerHomeButton}
    />
  );

  const title = movieTitle?.toUpperCase() || 'CHỌN SUẤT CHIẾU';

  return (
    <View style={styles.container}>
      <Body 
        showBack 
        title={title} 
        rightComponent={renderHomeButton()}
        scrollable
        style={styles.container}
      >
        <StepProgress currentStep={0} />
        
        <DateSelector 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
        
        {isLoading ? (
          <AppText style={{ textAlign: 'center', marginTop: 32, color: Colors.textInactive }}>Đang tải suất chiếu...</AppText>
        ) : (
          <CinemaList 
            cinemas={cinemas || []}
            selectedShowtimeId={selectedShowtime?.showtime?.id}
            onSelectShowtime={handleSelectShowtime}
          />
        )}
      </Body>

      <View style={styles.footer}>
        <View style={styles.footerPriceInfo}>
          <AppText style={styles.footerPriceLabel}>Tạm tính</AppText>
          <AppText style={styles.footerPriceValue}>0đ</AppText>
        </View>
        <AppButton
          title="Tiếp tục"
          disabled={!selectedShowtime}
          onPress={handleContinue}
          style={!selectedShowtime ? { backgroundColor: '#333' } : { paddingHorizontal: 32 }}
          textStyle={!selectedShowtime ? { color: '#666' } : undefined}
        />
      </View>
    </View>
  );
};

export default ShowtimeScreen;
