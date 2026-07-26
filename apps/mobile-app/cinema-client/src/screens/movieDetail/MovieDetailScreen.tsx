import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { Body } from '@components/layout/Body';
import { AppText } from '@components/AppText';
import { getMovieDetail } from './api';
import { styles } from './styles';
import { 
  MovieDetailSkeleton, 
  MovieDetailBackdrop, 
  MovieDetailInfo, 
  MovieDetailFooter 
} from './components';
import { useAuth } from '@hooks/useAuth';

const MovieDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { movieId } = route.params;
  const { isAuthenticated } = useAuth();

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movieDetail', movieId],
    queryFn: () => getMovieDetail(movieId),
  });

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Showtime', { movieId, movieTitle: movie?.title || 'Phim' });
  };

  if (isLoading) {
    return (
      <Body showBack title="Đang tải..." style={styles.container}>
        <MovieDetailSkeleton />
      </Body>
    );
  }

  if (isError || !movie) {
    return (
      <Body showBack title="Chi tiết phim" style={styles.container}>
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>Không thể tải thông tin phim.</AppText>
        </View>
      </Body>
    );
  }

  return (
    <Body showBack title={movie.title} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <MovieDetailBackdrop movie={movie} />
        <MovieDetailInfo movie={movie} />
      </ScrollView>

      <MovieDetailFooter onPress={handleBuyTicket} />
    </Body>
  );
};

export default MovieDetailScreen;
