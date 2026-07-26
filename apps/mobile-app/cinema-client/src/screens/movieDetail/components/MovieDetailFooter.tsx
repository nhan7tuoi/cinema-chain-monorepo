import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { styles } from '../styles';

interface Props {
  onPress: () => void;
}

export const MovieDetailFooter: React.FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.footer}>
      <AppButton 
        title="Mua Vé Ngay"
        onPress={onPress}
        style={styles.buyButton} 
      />
    </View>
  );
};
