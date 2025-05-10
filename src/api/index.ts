import { config } from '@/helpers/config';
import axios from 'axios';
import { setupInterceptors } from './interceptors';

const createAxiosInstance = (url: string, timeoutSeconds: number = 15) =>
  axios.create({
    baseURL: url,
    timeout: timeoutSeconds * 1000,
    withCredentials: true
  });

export const userApiInstance = createAxiosInstance(`${config.ACCOUNT_URL}`);
export const drawingApiInstance = createAxiosInstance(`${config.DRAWING_URL}`);
export const gameApiInstance = createAxiosInstance(`${config.GAME_URL}/game`);

export const ApiInstances = [userApiInstance, drawingApiInstance, gameApiInstance];

export const setAuthHeaderToInstances = (accessToken: string) => {
  ApiInstances.forEach(
    (instance) => (instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`)
  );
};

export const removeAuthHeaderFromInstances = () => {
  ApiInstances.forEach((instance) => delete instance.defaults.headers.common['Authorization']);
};

ApiInstances.forEach(setupInterceptors);
