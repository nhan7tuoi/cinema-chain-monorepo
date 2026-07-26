import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { promotionCardStyles as styles } from './styles';

interface PromotionCardProps {
  item: any;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.promoCard} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.promoImage} />
      <View style={styles.promoInfo}>
        <AppText style={styles.promoTitle} numberOfLines={1}>{item.title}</AppText>
        <AppText style={styles.promoDesc} numberOfLines={2}>{item.description}</AppText>
      </View>
    </TouchableOpacity>
  );
};
