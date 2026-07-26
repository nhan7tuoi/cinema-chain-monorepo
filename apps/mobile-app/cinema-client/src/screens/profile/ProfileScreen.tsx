import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { useAuth } from '@hooks/useAuth';
import { Colors } from '@constants/colors';
import { styles } from './styles';

const ProfileScreen = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Tài khoản</AppText>
      
      {user ? (
        <View style={styles.userInfoContainer}>
          <AppText style={styles.username}>Xin chào, {user.fullName || user.email}</AppText>
        </View>
      ) : (
        <View style={styles.userInfoContainer}>
          <AppText style={styles.username}>Chưa đăng nhập</AppText>
        </View>
      )}

      <AppButton 
        title="Đăng xuất" 
        onPress={handleLogout} 
        style={styles.logoutButton}
        type="outline"
      />
    </View>
  );
};



export default ProfileScreen;
