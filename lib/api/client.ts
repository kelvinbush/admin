'use client';

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useMemo, useCallback } from 'react';

// Create a base API client factory
export const createApiClient = () => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
  });

  // Enhanced response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Handle unauthorized errors - redirect to sign-in
        console.error('Authentication error - redirecting to sign-in');
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      } else if (error.response?.status === 403) {
        // Handle forbidden errors
        console.error('Access forbidden');
      } else if (error.response && error.response.status >= 500) {
        // Handle server errors
        console.error('Server error:', error.response.data);
      } else if (error.code === 'ECONNABORTED') {
        // Handle timeout errors
        console.error('Request timeout');
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Hook to use the API with authentication
export const useApiWithAuth = () => {
  const { getToken } = useAuth();
  const apiClient = useMemo(() => createApiClient(), []);

  // Memoized function to get auth token with error handling
  const getAuthToken = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      return token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      throw error;
    }
  }, [getToken]);

  // Memoized function to create auth config
  const createAuthConfig = useCallback(async (config?: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const token = await getAuthToken();
    return {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }, [getAuthToken]);

  // Memoized API object with all HTTP methods
  const api = useMemo(() => ({
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const authConfig = await createAuthConfig(config);
        const response: AxiosResponse<T> = await apiClient.get(url, authConfig);
        return response.data;
      } catch (error) {
        console.error('API GET Error:', error);
        throw error;
      }
    },

    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const authConfig = await createAuthConfig(config);
        const response: AxiosResponse<T> = await apiClient.post(url, data, authConfig);
        return response.data;
      } catch (error) {
        console.error('API POST Error:', error);
        throw error;
      }
    },

    put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const authConfig = await createAuthConfig(config);
        const response: AxiosResponse<T> = await apiClient.put(url, data, authConfig);
        return response.data;
      } catch (error) {
        console.error('API PUT Error:', error);
        throw error;
      }
    },

    patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const authConfig = await createAuthConfig(config);
        const response: AxiosResponse<T> = await apiClient.patch(url, data, authConfig);
        return response.data;
      } catch (error) {
        console.error('API PATCH Error:', error);
        throw error;
      }
    },

    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const authConfig = await createAuthConfig(config);
        const response: AxiosResponse<T> = await apiClient.delete(url, authConfig);
        return response.data;
      } catch (error) {
        console.error('API DELETE Error:', error);
        throw error;
      }
    },
  }), [apiClient, createAuthConfig]);

  return api;
};
