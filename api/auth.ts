/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import axios from 'axios';
import { API } from '~/lib/constants';
const api = axios.create({
  baseURL: `${API}/auth`,
  timeout: 10000,
});

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
  const response = await api.post('/signup', { email, password, confirmPassword });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/signin', { email, password });
  return response.data;
};
