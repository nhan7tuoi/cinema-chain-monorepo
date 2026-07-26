import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { Bell } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { AppText } from '@components/AppText';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Body } from '@components/layout/Body';
import { Section } from '@components/common/Section';
import { 
  HeroCarousel, 
  MovieCard, 
  PromotionCard, 
  CinemaCard, 
  HeroSkeleton, 
  HorizontalListSkeleton 
} from './components';
import { getHomePageData, getNowShowingMovies, getHomePromotions, getNearbyCinemas } from './api';
import { styles } from './styles';

const HomeScreen = () => {

  const { data: homeData, isLoading: isHomeLoading } = useQuery({
    queryKey: ['homeData'],
    queryFn: getHomePageData,
  });

  const { data: nowShowingMovies = [], isLoading: isNowShowingLoading } = useQuery({
    queryKey: ['nowShowingMovies'],
    queryFn: () => getNowShowingMovies(10),
  });

  const { data: promotions = [], isLoading: isPromotionsLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: getHomePromotions,
  });

  const { data: cinemas = [], isLoading: isCinemasLoading } = useQuery({
    queryKey: ['cinemas'],
    queryFn: getNearbyCinemas,
  });

  const trendingMovies = homeData?.trendingMovies || [];

  const renderLeftHeader = () => (
    <AppText style={{ fontSize: 22, fontWeight: 'bold', color: Colors.primary }}>
      CINEMA
    </AppText>
  );

  const renderRightHeader = () => (
    <TouchableOpacity style={{ padding: 4 }} activeOpacity={0.7}>
      <Bell color={Colors.textActive} size={24} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0" stopColor="#4a0000" stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <Body 
        scrollable 
        style={styles.content}
        containerStyle={{ backgroundColor: 'transparent' }}
        leftComponent={renderLeftHeader()}
        rightComponent={renderRightHeader()}
      >
        {isHomeLoading ? (
          <HeroSkeleton />
        ) : (
          <HeroCarousel movies={trendingMovies.slice(0, 5)} />
        )}

      <Section title="Phim Đang Hot">
        {isHomeLoading ? (
          <HorizontalListSkeleton type="movie" />
        ) : (
          <FlatList
            data={trendingMovies}
            renderItem={({ item }) => <MovieCard item={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Section>

      <Section title="Phim Đang Chiếu">
        {isNowShowingLoading ? (
          <HorizontalListSkeleton type="movie" />
        ) : (
          <FlatList
            data={nowShowingMovies}
            renderItem={({ item }) => <MovieCard item={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Section>

      <Section title="Khuyến Mãi">
        {isPromotionsLoading ? (
          <HorizontalListSkeleton type="promo" />
        ) : (
          <FlatList
            data={promotions}
            renderItem={({ item }) => <PromotionCard item={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Section>

      <Section title="Rạp Gần Bạn">
        {isCinemasLoading ? (
          <HorizontalListSkeleton type="cinema" />
        ) : (
          <FlatList
            data={cinemas}
            renderItem={({ item }) => <CinemaCard item={item} />}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Section>
      
      <View style={{ height: 120 }} />
      </Body>
    </View>
  );
};

export default HomeScreen;

