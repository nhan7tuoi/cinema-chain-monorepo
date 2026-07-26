import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMovieReviews, createMovieReview } from '../api';
import { styles as globalStyles } from '../styles';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface Props {
  movieId: number;
  averageRating: number;
}

export const RatingReviewSection: React.FC<Props> = ({ movieId, averageRating }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['movieReviews', movieId],
    queryFn: () => getMovieReviews(movieId),
  });

  const mutation = useMutation({
    mutationFn: (newReview: { rating: number; content: string }) => {
      return createMovieReview(movieId, newReview.rating, newReview.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movieReviews', movieId] });
      queryClient.invalidateQueries({ queryKey: ['movieDetail', movieId] });
      setIsModalVisible(false);
      setRating(0);
      setContent('');
    },
  });

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    mutation.mutate({ rating, content });
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i <= Math.round(ratingValue) ? '#e50914' : '#555'}
          fill={i <= Math.round(ratingValue) ? '#e50914' : 'transparent'}
        />
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  const renderRatingBar = (starLevel: number, count: number, maxCount: number) => {
    const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
      <View style={styles.barRow} key={starLevel}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${width}%` }]} />
        </View>
      </View>
    );
  };

  if (isLoading || !data) {
    return null; // Or a loader
  }

  const distribution = data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalReviews = Object.values(distribution).reduce((a: any, b: any) => a + b, 0) as number;
  const maxReviews = Math.max(...(Object.values(distribution) as number[]));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText style={globalStyles.sectionTitle}>Xếp hạng & đánh giá</AppText>
        <TouchableOpacity>
          <AppText style={styles.seeAllText}>Xem tất cả</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.scoreContainer}>
          <AppText style={styles.scoreText}>
            {averageRating ? averageRating.toFixed(1) : '0.0'}
          </AppText>
          {renderStars(averageRating)}
        </View>

        <View style={styles.distributionContainer}>
          {[5, 4, 3, 2, 1].map(star => renderRatingBar(star, distribution[star], totalReviews))}
        </View>
      </View>

      <AppButton
        title="Viết đánh giá"
        onPress={handleWriteReview}
        style={styles.writeButton}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Viết đánh giá của bạn</AppText>

            <View style={styles.ratingInputRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Star
                    size={32}
                    color={i <= rating ? '#e50914' : '#555'}
                    fill={i <= rating ? '#e50914' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Chia sẻ cảm nghĩ của bạn về bộ phim..."
              placeholderTextColor="#888"
              multiline
              value={content}
              onChangeText={setContent}
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Hủy"
                type="outline"
                onPress={() => setIsModalVisible(false)}
                style={styles.actionButton}
              />
              <AppButton
                title="Gửi"
                onPress={handleSubmit}
                loading={mutation.isPending}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: '#aaaaaa',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  distributionContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 8,
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#e50914',
    borderRadius: 3,
  },
  writeButton: {
    backgroundColor: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
});
