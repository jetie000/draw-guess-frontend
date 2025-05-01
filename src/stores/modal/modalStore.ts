import { getErrorMessage } from '@/helpers/errors';
import { defineStore } from 'pinia';

export interface ModalStore {
  messageError: string;
  isErrorModalOpen: boolean;
  level: number;
  isLevelModalOpen: boolean;
}

export const useModalStore = defineStore('modal', {
  state: (): ModalStore => ({
    messageError: '',
    isErrorModalOpen: false,
    level: 1,
    isLevelModalOpen: false
  }),
  actions: {
    showErrorModal(message: string | unknown) {
      if (typeof message === 'string') {
        this.messageError = message;
      } else {
        this.messageError = getErrorMessage(message);
      }
      this.isErrorModalOpen = true;
    },
    showLevelModal(level: number) {
      this.level = level;
      this.isLevelModalOpen = true;
    },
    hideModal() {
      this.isErrorModalOpen = false;
    }
  }
});
