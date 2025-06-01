import { UserApi } from './user/user.api';
import { isAxiosError, type AxiosInstance } from 'axios';
import { useUserStore } from '@/stores/user/userStore';
import { router } from '@/router';

const ignoreUrlsToRetry = [
  '/login',
  '/sign-up',
  '/request-code',
  '/reset-password',
  '/refresh-token'
];

const onResponseError = async (instance: AxiosInstance, error: any) => {
  const originalRequest = error.config;
  const userStore = useUserStore();

  if (
    error.response.status === 401 &&
    !userStore.isLoadingRefresh &&
    !originalRequest._retry &&
    !ignoreUrlsToRetry.some((url) => error.config.url.includes(url))
  ) {
    originalRequest._retry = true;

    try {
      userStore.isLoadingRefresh = true;
      const { accessToken } = await UserApi.refreshToken();
      userStore.setToken(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return instance(originalRequest);
    } catch (refreshError) {
      if (
        !isAxiosError(refreshError) ||
        (isAxiosError(refreshError) && refreshError.status !== 404 && originalRequest._retry)
      ) {
        userStore.removeToken();
        router.push({ name: 'Login' });
      }

      return Promise.reject(refreshError);
    } finally {
      userStore.isLoadingRefresh = false;
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
