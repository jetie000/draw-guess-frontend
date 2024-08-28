import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    message: '',
    isAlertOpen: false
  }),
  actions: {
    showAlert(message: string) {
      this.message = message;
      this.isAlertOpen = true;
    },
    hideAlert() {
      this.message = '';
      this.isAlertOpen = false;
    }
  }
});
