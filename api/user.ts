/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import axios from 'axios';
import { API } from '~/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  image?: string;
  dateOfBirth?: string;
  Gender?: string;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string; categoryId: string }[];
  notifications: { id: string; message: string; read: boolean }[];
  outfits: { id: string; images: { id: string; url: string }[] }[];
  sessions: { id: string; token: string }[];
}

const api = axios.create({
  baseURL: `${API}/user`,
  timeout: 10000,
});

// Add auth token interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const updateUser = async (data: {
  name?: string;
  dateOfBirth?: string;
  image?: File | string | null;
}): Promise<UserResponse> => {
  try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
    if (data.image && typeof data.image === 'string') {
      const fileInfo = await FileSystem.getInfoAsync(data.image);
      const fileType = data.image.split('.').pop() || 'jpg';
      formData.append('image', {
        uri: data.image,
        name: `profile-image.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      formData.append('isProfileImage', 'true');
    } else if (data.image === null) {
      formData.append('image', '');
    }

    const response = await api.patch('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Update User Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update User Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get('/');
    console.log('Get User Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get User Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    const response = await api.delete('/');
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Failed to delete account');
    }
    await AsyncStorage.removeItem('authToken');
    console.log('Delete User Response:', response.data);
  } catch (error: any) {
    console.error('Delete User Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  try {
    const response = await api.patch('/password', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.data?.message || 'Failed to change password');
    }
    console.log('Change Password Response:', response.data);
  } catch (error: any) {
    console.error('Change Password Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};
