import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

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

  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // You can add auth tokens, logging, etc. here
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle common errors here
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

