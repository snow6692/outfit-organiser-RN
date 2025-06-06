/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import axios from 'axios';
import { API } from '~/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the response from the backend
interface ImageResponse {
  id: string;
  url: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: `${API}/image`,
  timeout: 10000,
});

// Add a request interceptor to include the auth token
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

// Handle 401 errors by redirecting to login
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

export const uploadImage = async (imageUri: string, categoryId: string): Promise<ImageResponse> => {
  const formData = new FormData();
  // Ensure the image URI is correctly formatted for FormData
  formData.append('image', {
    uri: imageUri,
    name: `image-${Date.now()}.jpg`, // Unique name to avoid conflicts
    type: 'image/jpeg', // Adjust type based on the image format (you might need to dynamically detect this)
  } as any); // TypeScript workaround for FormData
  formData.append('categoryId', categoryId);

  // Log the FormData content for debugging
  // console.log('FormData Content:', {
  //   imageUri,
  //   categoryId,
  //   formData: JSON.stringify(formData), // Note: FormData logging might not show all details
  // });

  try {
    const response = await api.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log('Upload Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Upload Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

export const deleteImage = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/${id}`);
    console.log(`Delete Image Response (ID: ${id}):`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Delete Image Error (ID: ${id}):`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to delete image with ID ${id}`);
  }
};
