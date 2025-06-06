/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import axios from 'axios';
import { API } from '~/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScheduleResponse {
  id: string;
  userId: string;
  outfitId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  outfit: {
    id: string;
    favorite: boolean;
    images: {
      id: string;
      url: string;
      categoryId: string;
      Category: { name: string };
    }[];
  };
}

const api = axios.create({
  baseURL: `${API}/schedules`,
  timeout: 10000,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const createSchedule = async (outfitId: string, date: string): Promise<ScheduleResponse> => {
  try {
    const response = await api.post('/', { outfitId, date });
    console.log('Create Schedule Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create Schedule Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create schedule');
  }
};

export const getUserSchedules = async (
  year?: number,
  month?: number
): Promise<ScheduleResponse[]> => {
  try {
    const params = year && month ? { year, month } : year ? { year } : {};
    const response = await api.get('/', { params });
    // console.log('Get Schedules Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get Schedules Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch schedules');
  }
};

export const updateSchedule = async (
  scheduleId: string,
  outfitId?: string,
  date?: string
): Promise<ScheduleResponse> => {
  try {
    const response = await api.patch(`/${scheduleId}`, { outfitId, date });
    console.log(`Update Schedule Response (ID: ${scheduleId}):`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      `Update Schedule Error (ID: ${scheduleId}):`,
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || 'Failed to update schedule');
  }
};

export const deleteSchedule = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/${id}`);
    console.log(`Delete Schedule Response (ID: ${id}):`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Delete Schedule Error (ID: ${id}):`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete schedule');
  }
};
