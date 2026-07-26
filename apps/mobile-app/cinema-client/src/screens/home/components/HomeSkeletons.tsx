import React from 'react';
import { View, FlatList } from 'react-native';
import { Skeleton } from '@components/common/Skeleton';
import { homeSkeletonsStyles as styles } from './styles';

export const HeroSkeleton = () => {
  return (
    <View style={styles.heroContainer}>
      <Skeleton style={styles.heroSkeleton} />
    </View>
  );
};

export const MovieCardSkeleton = () => {
  return (
    <View style={styles.movieCard}>
      <Skeleton style={styles.moviePoster} />
      <Skeleton style={styles.movieTitle1} />
      <Skeleton style={styles.movieTitle2} />
    </View>
  );
};

export const PromotionCardSkeleton = () => {
  return (
    <View style={styles.promoCard}>
      <Skeleton style={styles.promoImage} />
      <View style={styles.promoInfo}>
        <Skeleton style={styles.promoTitle} />
        <Skeleton style={styles.promoDesc1} />
        <Skeleton style={styles.promoDesc2} />
      </View>
    </View>
  );
};

export const CinemaCardSkeleton = () => {
  return (
    <View style={styles.cinemaCard}>
      <Skeleton style={styles.cinemaName} />
      <Skeleton style={styles.cinemaAddress} />
      <Skeleton style={styles.cinemaDistance} />
    </View>
  );
};

export const HorizontalListSkeleton = ({ type, count = 3 }: { type: 'movie' | 'promo' | 'cinema', count?: number }) => {
  const renderItem = () => {
    switch (type) {
      case 'movie':
        return <MovieCardSkeleton />;
      case 'promo':
        return <PromotionCardSkeleton />;
      case 'cinema':
        return <CinemaCardSkeleton />;
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={Array(count).fill(0)}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={false}
    />
  );
};


