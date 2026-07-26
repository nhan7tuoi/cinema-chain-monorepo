import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@store/index';
import { setCredentials, logoutAction, setAuthLoading, User } from '@store/slices/authSlice';
import apiClient from '@api/apiClient';

const AUTH_STORAGE_KEY = '@cinema_auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  const initAuth = useCallback(async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        dispatch(setCredentials(authData));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${authData.accessToken}`;
      }
    } catch (error) {
      console.error('Failed to load user from async storage', error);
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(
    async (userObj: User, accessToken: string, refreshToken: string) => {
      try {
        const authData = { user: userObj, accessToken, refreshToken };
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        dispatch(setCredentials(authData));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Failed to save auth data to async storage', error);
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      dispatch(logoutAction());
      delete apiClient.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Failed to remove user from async storage', error);
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    login,
    logout,
  };
};
