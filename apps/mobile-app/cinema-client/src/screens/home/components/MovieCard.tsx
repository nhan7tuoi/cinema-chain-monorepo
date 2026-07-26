import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '@components/AppText';
import { movieCardStyles as styles } from './styles';

interface MovieCardProps {
  item: any;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      style={styles.movieCard} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <Image source={{ uri: item.posterUrl }} style={styles.moviePoster} />
      <AppText style={styles.movieTitle} numberOfLines={1}>{item.title}</AppText>
    </TouchableOpacity>
  );
};