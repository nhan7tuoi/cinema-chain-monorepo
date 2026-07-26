import React, { useState } from 'react';
import { 
  View, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@components/AppText';
import { useAuth } from '@hooks/useAuth';
import { AppButton } from '@components/AppButton';
import { AppTextInput } from '@components/AppTextInput';
import { loginApi } from './api';
import { Colors } from '@constants/colors';
import { Film, ChevronLeft } from 'lucide-react-native';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const canGoBack = navigation.canGoBack();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState(__DEV__ ? 'customer.demo@cinema.com' : '');
  const [password, setPassword] = useState(__DEV__ ? 'Admin@2026' : '');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi({ email, password });
      
      if (response && response.user && response.accessToken) {
        await login(response.user, response.accessToken, response.refreshToken);
        if (canGoBack) {
          navigation.goBack();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
        return;
      } else {
        Alert.alert('Lỗi', 'Dữ liệu trả về không hợp lệ');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      Alert.alert('Lỗi', message);
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgBackground}>
        <Svg height={height} width={width}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.15" />
              <Stop offset="40%" stopColor={Colors.background} stopOpacity="1" />
              <Stop offset="100%" stopColor={Colors.background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
        </Svg>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Film color={Colors.primary} size={48} strokeWidth={2} />
              </View>
              <AppText style={styles.title}>Chào mừng trở lại!</AppText>
              <AppText style={styles.subtitle}>Đăng nhập để đặt vé xem phim ngay.</AppText>
            </View>

            <View style={styles.formContainer}>
              <AppTextInput
                label="Email"
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <AppTextInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <AppButton 
                type="text"
                title="Quên mật khẩu?"
                style={styles.forgotPasswordButton} 
                textStyle={styles.forgotPasswordText}
              />
            </View>

            <View style={styles.actionContainer}>
              <AppButton 
                title="Đăng nhập"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
              />
              <View style={styles.registerContainer}>
                <AppText style={styles.registerText}>Chưa có tài khoản? </AppText>
                <AppButton 
                  type="text"
                  title="Đăng ký ngay"
                  textStyle={styles.registerLink}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {canGoBack && (
        <AppButton 
          type="text"
          icon={<ChevronLeft color={Colors.textActive} size={32} />}
          style={[styles.backButton, { top: Math.max(insets.top, 20) + 10 }]} 
          onPress={() => navigation.goBack()}
        />
      )}
    </View>
  );
};

export default LoginScreen;
