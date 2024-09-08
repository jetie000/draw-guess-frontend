import { storageKeys } from '@/helpers/constants';
import { defineStore } from 'pinia';
import { removeAuthHeaderFromInstances, setAuthHeaderToInstances } from '@/api';
import type { UserStore } from './userStore.interface';

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    token: localStorage.getItem(storageKeys.token)
  }),
  actions: {
    login(accessToken: string) {
      this.token = accessToken;
      localStorage.setItem(storageKeys.token, accessToken);
      setAuthHeaderToInstances(accessToken);
    },
    logout() {
      localStorage.removeItem(storageKeys.token);
      this.token = null;
      removeAuthHeaderFromInstances();
    }
  },
  getters: {}
});
