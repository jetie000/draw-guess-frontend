import { storageKeys } from '@/helpers/constants';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(storageKeys.token) || null
  }),
  actions: {},
  getters: {}
});
