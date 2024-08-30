import { AlertDurationSeconds, AlertTypes } from '@/typings/enums/alert';
import type { AlertStore } from '@/typings/interfaces/alert';
import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: (): AlertStore => ({
    message: '',
    isAlertOpen: false,
    type: AlertTypes.Info,
    timeOut: null
  }),
  actions: {
    showAlert(message: string, type: AlertTypes = AlertTypes.Success) {
      this.message = message;
      this.type = type;
      this.isAlertOpen = true;
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(() => {
        this.hideAlert();
      }, AlertDurationSeconds * 1000);
    },
    hideAlert() {
      this.isAlertOpen = false;
    }
  }
});
