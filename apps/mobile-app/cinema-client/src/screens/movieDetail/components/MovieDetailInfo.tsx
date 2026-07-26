import React from 'react';
import { View } from 'react-native';
import { Clock, Calendar, Film } from 'lucide-react-native';
import { AppText } from '@components/AppText';
import { MovieDetail } from '@type/movie';
import { styles } from '../styles';
import { RatingReviewSection } from './RatingReviewSection';

interface Props {
  movie: MovieDetail;
}

export const MovieDetailInfo: React.FC<Props> = ({ movie }) => {
  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('vi-VN');

  return (
    <View style={styles.contentContainer}>
      <AppText style={styles.title}>{movie.title}</AppText>
      
      <View style={styles.infoRow}>
        {movie.ageRating && (
          <View style={styles.ageRatingTag}>
            <AppText style={styles.ageRatingText}>{movie.ageRating}</AppText>
          </View>
        )}
        
        <View style={styles.infoTag}>
          <Clock color="#aaaaaa" size={14} />
          <AppText style={styles.infoText}>{movie.duration} phút</AppText>
        </View>

        <View style={styles.infoTag}>
          <Calendar color="#aaaaaa" size={14} />
          <AppText style={styles.infoText}>{releaseDate}</AppText>
        </View>

        <View style={styles.infoTag}>
          <Film color="#aaaaaa" size={14} />
          <AppText style={styles.infoText}>{movie.format}</AppText>
        </View>
      </View>

      {movie.genre && (
        <AppText style={styles.castInfo}>
          Thể loại: <AppText style={styles.highlight}>{movie.genre}</AppText>
        </AppText>
      )}

      {movie.director && (
        <AppText style={styles.castInfo}>
          Đạo diễn: <AppText style={styles.highlight}>{movie.director}</AppText>
        </AppText>
      )}

      {movie.cast && (
        <AppText style={styles.castInfo}>
          Diễn viên: <AppText style={styles.highlight}>{movie.cast}</AppText>
        </AppText>
      )}

      <AppText style={styles.sectionTitle}>Nội Dung Phim</AppText>
      <AppText style={styles.synopsis}>{movie.synopsis || 'Đang cập nhật nội dung...'}</AppText>
      
      <RatingReviewSection movieId={movie.id} averageRating={Number(movie.averageRating || 0)} />
    </View>
  );
};
