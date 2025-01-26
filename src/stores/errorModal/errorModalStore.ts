import { getErrorMessage } from '@/helpers/errors';
import { defineStore } from 'pinia';

export interface ErrorModalStore {
  message: string;
  isModalOpen: boolean;
}

export const useErrorModalStore = defineStore('error-modal', {
  state: (): ErrorModalStore => ({
    message: '',
    isModalOpen: false
  }),
  actions: {
    showModal(message: string | unknown) {
      if (typeof message === 'string') {
        this.message = message;
      } else {
        this.message = getErrorMessage(message);
      }
      this.isModalOpen = true;
    },
    hideModal() {
      this.isModalOpen = false;
    }
  }
});
