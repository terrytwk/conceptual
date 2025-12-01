import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuthData } from './auth-storage';
import { refreshTokens } from './auth';

/**
 * Get the server URL from environment variables
 * Supports both client-side (NEXT_PUBLIC_SERVER_URL) and server-side (SERVER_URL)
 */
const getServerUrl = (): string => {
  // For client-side: use NEXT_PUBLIC_SERVER_URL
  // For server-side: use SERVER_URL
  const serverUrl =
    (typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_SERVER_URL
      : process.env.SERVER_URL) ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    'http://localhost:8000';

  return serverUrl;
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Create axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const serverUrl = getServerUrl();
  const baseURL = `${serverUrl}/api`;

  const apiClient = axios.create({
    baseURL,
    timeout: 10000, // 10 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - inject access token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // If FormData is being sent, let axios automatically set Content-Type with boundary
      // Don't override with application/json
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      // Skip token injection for auth endpoints that don't require it
      // /auth/register, /auth/login, and /auth/refresh don't need tokens
      // /auth/logout and /auth/_getUser DO need tokens (but they're set explicitly in auth.ts)
      if (config.url === '/auth/register' ||
        config.url === '/auth/login' ||
        config.url === '/auth/refresh') {
        return config;
      }

      // If Authorization header is already set (e.g., by explicit call in auth.ts), don't override
      if (config.headers?.Authorization) {
        return config;
      }

      // Inject token for all other endpoints
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token refresh
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        // Skip refresh for auth endpoints
        if (originalRequest.url?.startsWith('/auth/')) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          clearAuthData();
          processQueue(new Error('No refresh token available'), null);
          isRefreshing = false;
          return Promise.reject(error);
        }

        try {
          const { accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);
          setAccessToken(accessToken);
          setRefreshToken(newRefreshToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          isRefreshing = false;

          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear auth data and reject
          clearAuthData();
          processQueue(refreshError, null);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network Error:', error.request);
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Export the configured axios instance
export const apiClient = createApiClient();

// Export axios types for convenience
export type { AxiosRequestConfig, AxiosResponse, AxiosError };

// Export convenience methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

// Default export
export default apiClient;

