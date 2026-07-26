import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { ChevronLeft, Search } from 'lucide-react-native';
import { Colors } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@components/AppText';
import { styles } from './styles';

const SearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color={Colors.textActive} size={28} />
        </TouchableOpacity>
        
        <Animated.View sharedTransitionTag="searchBar" style={styles.searchBarContainer}>
          <Search color={Colors.textInactive} size={20} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Tìm kiếm phim, rạp..."
            placeholderTextColor={Colors.textInactive}
            selectionColor={Colors.primary}
            autoCapitalize="none"
          />
        </Animated.View>
      </View>

      <View style={styles.content}>
        <AppText style={styles.emptyText}>Bắt đầu gõ để tìm kiếm...</AppText>
      </View>
    </View>
  );
};



export default SearchScreen;
