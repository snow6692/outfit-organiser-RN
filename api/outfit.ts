/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import axios from 'axios';
import { API } from '~/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of an outfit response
interface OutfitResponse {
  id: string;
  userId: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  images: {
    id: string;
    url: string;
    categoryId: string;
    Category: { name: string };
  }[];
}

const api = axios.create({
  baseURL: `${API}/outfit`,
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

export const createOutfit = async (
  images: string[],
  favorite: boolean = false
): Promise<OutfitResponse> => {
  try {
    const response = await api.post('/', { images, favorite });
    console.log('Create Outfit Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create Outfit Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create outfit');
  }
};

export const getUserOutfits = async (): Promise<OutfitResponse[]> => {
  try {
    const response = await api.get('/');
    console.log('Get Outfits Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get Outfits Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch outfits');
  }
};

export const deleteOutfit = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/${id}`);
    console.log(`Delete Outfit Response (ID: ${id}):`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Delete Outfit Error (ID: ${id}):`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to delete outfit with ID ${id}`);
  }
};

export const getWishlistOutfits = async () => {
  try {
    const response = await api.get('/outfit', {
      params: { wishlist: true },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to get wishlist outfits`);
  }
};

export const toggleWishlist = async (outfitId: string) => {
  try {
    const response = await api.patch(`/outfit/${outfitId}/wishlist`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || `Failed to toggle favorite outfit`);
  }
};
