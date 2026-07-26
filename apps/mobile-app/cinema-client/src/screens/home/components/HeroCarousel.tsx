import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeMovie } from '@type/movie';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { heroCarouselStyles as styles } from './styles';

interface HeroCarouselProps {
  movies: HomeMovie[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= movies.length) {
        nextIndex = 0;
      }
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, movies.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== currentIndex) {
      setCurrentIndex(roundIndex);
    }
  };

  const renderItem = ({ item }: { item: HomeMovie }) => (
    <View style={styles.heroSection}>
      <Image
        source={{ uri: item.backdropUrl || item.posterUrl || '' }}
        style={styles.heroImage}
      />
      <View style={styles.heroOverlay}>
        <AppText style={styles.heroTitle} numberOfLines={2}>
          {item.title}
        </AppText>
        <AppText style={styles.heroGenre}>{item.genre}</AppText>
        <AppButton 
          title="Đặt vé ngay"
          onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
          style={styles.heroButton} 
        />
      </View>
    </View>
  );

  if (movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? String(item.id) : index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      <View style={styles.pagination}>
        {movies.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};


