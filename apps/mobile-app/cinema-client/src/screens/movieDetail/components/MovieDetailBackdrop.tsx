import React from 'react';
import { View, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Play } from 'lucide-react-native';
import { MovieDetail } from '@type/movie';
import { styles } from '../styles';

interface Props {
  movie: MovieDetail;
}

export const MovieDetailBackdrop: React.FC<Props> = ({ movie }) => {
  const handlePlayTrailer = async () => {
    if (!movie.trailerUrl) return;
    
    try {
      await Linking.openURL(movie.trailerUrl);
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi mở trailer.');
    }
  };

  return (
    <View style={styles.backdropContainer}>
      <Image
        source={{ uri: movie.backdropUrl || movie.posterUrl || '' }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <View style={styles.gradient} />
      {movie.trailerUrl && (
        <TouchableOpacity 
          style={styles.playButtonContainer} 
          activeOpacity={0.7}
          onPress={handlePlayTrailer}
        >
          <Play color="#fff" size={24} fill="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};
