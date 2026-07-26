import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { AppText } from '@components/AppText';
import { Body } from '@components/layout/Body';
import { styles } from './styles';

const BookingScreen = () => {
  const navigation = useNavigation<any>();

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
        title="TÌM KIẾM & ĐẶT VÉ"
        style={styles.content}
        containerStyle={{ backgroundColor: 'transparent' }}
        showBack={false}
      >
        <View style={styles.searchSection}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => navigation.navigate('Search')}
          >
            <Animated.View sharedTransitionTag="searchBar" style={styles.searchBarFake}>
              <Search color={Colors.textInactive} size={20} style={styles.searchIcon} />
              <AppText style={styles.searchText}>Tìm kiếm phim, rạp...</AppText>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.placeholder}>
          <AppText style={styles.placeholderText}>Khám phá phim mới ngay hôm nay!</AppText>
        </View>
      </Body>
    </View>
  );
};



export default BookingScreen;
