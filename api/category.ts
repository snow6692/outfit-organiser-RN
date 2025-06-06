/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '~/lib/constants';
import { categoriesTypes } from '../../back/src/types/category.types';

export const api = axios.create({
  baseURL: `${API}`,
  timeout: 10000,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken'); // Adjust the key based on your app
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
      // Redirect to login screen (you may need to adjust this based on your navigation setup)
      // router.replace('/login');
    }
    return Promise.reject(error);
  }
);
export const getAllCategories = async () => {
  try {
    const response = await api.get('/category');
    // console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error); // Debug log
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<categoriesTypes> => {
  try {
    const response = await api.get(`/category/${id}`);
    // console.log(`API Response (getCategoryById ${id}):`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`API Error (getCategoryById ${id}):`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};
