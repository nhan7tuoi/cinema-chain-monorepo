import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Tạo instance axios với cấu hình mặc định
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Interceptor cho Request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ cookies (để Middleware trên server cũng có thể đọc được)
    if (typeof window !== 'undefined') {
      const token = Cookies.get('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Có thể format lại response data ở đây nếu cần thiết
    return response;
  },
  async (error: AxiosError) => {
    // Xử lý các lỗi chung từ API
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

          // Xử lý logic logout nếu đang ở server hoặc url là auth/refresh hoặc đã thử retry rồi
          if (typeof window === 'undefined' || originalRequest.url === '/auth/refresh' || originalRequest._retry) {
            if (typeof window !== 'undefined') {
              Cookies.remove('access_token');
              Cookies.remove('refresh_token');
              Cookies.remove('user_info');
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
            }
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise(function(resolve, reject) {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return apiClient(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshToken = Cookies.get('refresh_token');
            if (!refreshToken) {
               throw new Error('No refresh token available');
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh`, {}, {
              headers: { Authorization: `Bearer ${refreshToken}` }
            });

            const { accessToken, refreshToken: newRefreshToken } = res.data;
            Cookies.set('access_token', accessToken);
            Cookies.set('refresh_token', newRefreshToken);
            
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            processQueue(null, accessToken);
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('user_info');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        case 403:
          console.error('Forbidden: Bạn không có quyền truy cập.');
          break;
        case 404:
          console.error('Not Found: Không tìm thấy tài nguyên.');
          break;
        case 500:
          console.error('Server Error: Có lỗi từ phía máy chủ.');
          break;
        default:
          console.error('API Error:', error.message);
      }
    } else if (error.request) {
      // Lỗi không nhận được phản hồi từ server (mất mạng, server sập...)
      console.error('Network Error: Không thể kết nối tới server.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
