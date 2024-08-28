import { storageKeys } from '@/helpers/constants';
import { defineStore } from 'pinia';
import { googleTokenLogin } from 'vue3-google-login';
import { useAlertStore } from './alertStore';
import { handleNetworkError } from '@/helpers/errors';
import { UserApi } from '@/api/user.api';
import { removeAuthHeaderFromInstances, setAuthHeaderToInstances } from '@/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(storageKeys.token) || null
  }),
  actions: {
    async loginByEmail(email: string, password: string) {
      try {
        const { accessToken } = await UserApi.login(email, password);
        this.token = accessToken;
        localStorage.setItem(storageKeys.token, accessToken);
        setAuthHeaderToInstances(accessToken);
        return true;
      } catch (error) {
        handleNetworkError(error);
        return false;
      }
    },
    async loginByGoogle() {
      try {
        const { access_token } = await googleTokenLogin();
        const { accessToken } = await UserApi.loginGoogle(access_token);
        this.token = accessToken;
        localStorage.setItem(storageKeys.token, accessToken);
        setAuthHeaderToInstances(accessToken);
        return true;
      } catch (error) {
        if (error instanceof Error && 'type' in error && error.type === 'popup_closed') {
          return false;
        }
        handleNetworkError(error);
        return false;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem(storageKeys.token);
      removeAuthHeaderFromInstances();
    },
    async signUp(email: string, username: string, password: string, confirmPassword: string) {
      if (password !== confirmPassword) {
        useAlertStore().showAlert('Passwords do not match');
      }
      try {
        await UserApi.signUp(email, username, password);
        return true;
      } catch (error) {
        handleNetworkError(error);
        return false;
      }
    }
  },
  getters: {}
});
