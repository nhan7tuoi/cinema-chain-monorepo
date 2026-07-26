import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@store/index';
import { setCredentials, logoutAction } from '@store/slices/authSlice';

const BASE_URL = 'http://192.168.1.92:3000/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const authDataStr = await AsyncStorage.getItem('@cinema_auth');
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        if (authData?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const authDataStr = await AsyncStorage.getItem('@cinema_auth');
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          
          if (authData?.refreshToken) {
            // Call refresh token API
            const refreshResponse = await axios.post(`${BASE_URL}/client/auth/refresh`, {}, {
              headers: { Authorization: `Bearer ${authData.refreshToken}` }
            });
            
            const newTokens = refreshResponse.data?.data || refreshResponse.data;
            if (newTokens?.accessToken) {
              // Update AsyncStorage
              const newAuthData = { ...authData, ...newTokens };
              await AsyncStorage.setItem('@cinema_auth', JSON.stringify(newAuthData));
              
              // Update Redux Store
              store.dispatch(setCredentials(newAuthData));
              
              // Retry original request
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return apiClient(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        // Refresh token failed or expired -> Logout user
        await AsyncStorage.removeItem('@cinema_auth');
        store.dispatch(logoutAction());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
