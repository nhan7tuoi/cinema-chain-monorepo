import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice';
import authReducer from './slices/authSlice';
import reactotron from '../config/ReactotronConfig';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
  },
  enhancers: (getDefaultEnhancers) => {
    return __DEV__ && reactotron
      ? getDefaultEnhancers().concat(reactotron.createEnhancer())
      : getDefaultEnhancers();
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
