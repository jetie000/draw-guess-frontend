import { storageKeys } from '@/helpers/constants';
import { defineStore } from 'pinia';
import { removeAuthHeaderFromInstances, setAuthHeaderToInstances } from '@/api';
import type { UserStore } from './userStore.interface';

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    token: localStorage.getItem(storageKeys.token)
  }),
  actions: {
    setToken(accessToken: string) {
      localStorage.setItem(storageKeys.token, accessToken);
      this.token = accessToken;
      setAuthHeaderToInstances(accessToken);
    },
    assignToken() {
      if (this.token) {
        setAuthHeaderToInstances(this.token);
      }
    },
    removeToken() {
      localStorage.removeItem(storageKeys.token);
      this.token = null;
      removeAuthHeaderFromInstances();
    }
  },
  getters: {}
});
