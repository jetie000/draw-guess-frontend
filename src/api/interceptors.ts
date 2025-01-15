import { UserApi } from './user/user.api';
import type { AxiosInstance } from 'axios';
import { useUserStore } from '@/stores/user/userStore';
import { router } from '@/router';

const onResponseError = async (instance: AxiosInstance, error: any) => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const userStore = useUserStore();

    try {
      const { accessToken } = await UserApi.refreshToken();
      userStore.setToken(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return instance(originalRequest);
    } catch (refreshError) {
      userStore.removeToken();
      router.push({ name: 'Login' });

      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (res) => res,
    async (error) => await onResponseError(instance, error)
  );
};
