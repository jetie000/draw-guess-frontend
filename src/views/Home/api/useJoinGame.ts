import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';
import { ref } from 'vue';

export const useJoinGame = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const joinGame = async (code: string) => {
    try {
      isSuccess.value = false;
      isLoading.value = true;
      const gameId = await GameApi.joinGame(code);
      isSuccess.value = true;
      return gameId;
    } catch (error) {
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return { joinGame, isLoading, isSuccess };
};
