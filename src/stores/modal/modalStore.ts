import type { Achievement } from '@/api/user/user.api.interface';
import { getErrorMessage } from '@/helpers/errors';
import { defineStore } from 'pinia';

export interface ModalStore {
  messageError: string;
  isErrorModalOpen: boolean;
  level: number;
  isLevelModalOpen: boolean;
  achievements: Achievement[];
  isAchievementModalOpen: boolean;
}

export const useModalStore = defineStore('modal', {
  state: (): ModalStore => ({
    messageError: '',
    isErrorModalOpen: false,
    level: 1,
    isLevelModalOpen: false,
    achievements: [],
    isAchievementModalOpen: false
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
    showAchievementsModal(achievements: Achievement[]) {
      this.achievements = achievements;
      this.isAchievementModalOpen = true;
    },
    hideErrorModal() {
      this.isErrorModalOpen = false;
    }
  }
});
