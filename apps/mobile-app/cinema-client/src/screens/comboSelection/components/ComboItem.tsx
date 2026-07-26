import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { AppText } from '@components/AppText';
import { Minus, Plus } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { styles } from '../styles';

export interface ComboType {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface ComboItemProps {
  combo: ComboType;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const ComboItem: React.FC<ComboItemProps> = ({
  combo,
  quantity,
  onIncrease,
  onDecrease,
}) => {
  return (
    <View style={styles.comboItem}>
      <Image 
        source={{ uri: combo.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.comboImage}
        resizeMode="cover"
      />
      <View style={styles.comboInfo}>
        <AppText style={styles.comboName} numberOfLines={1}>{combo.name}</AppText>
        <AppText style={styles.comboDescription} numberOfLines={2}>
          {combo.description}
        </AppText>
        
        <View style={styles.comboPriceRow}>
          <AppText style={styles.comboPrice}>
            {combo.price.toLocaleString('vi-VN')}đ
          </AppText>
          
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity === 0 && styles.quantityButtonDisabled]}
              onPress={onDecrease}
              disabled={quantity === 0}
            >
              <Minus color={quantity === 0 ? Colors.textInactive : Colors.textActive} size={16} />
            </TouchableOpacity>
            <AppText style={styles.quantityText}>{quantity}</AppText>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={onIncrease}
            >
              <Plus color={Colors.textActive} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
