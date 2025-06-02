import { storageKeys } from '@/helpers/constants';
import { defineStore } from 'pinia';
import { removeAuthHeaderFromInstances, setAuthHeaderToInstances } from '@/api';

export interface UserStore {
  token: string | null;
  isLoadingRefresh: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    token: localStorage.getItem(storageKeys.token),
    isLoadingRefresh: false
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
  }
});
