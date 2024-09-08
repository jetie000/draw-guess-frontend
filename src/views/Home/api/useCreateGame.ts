import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';
import { ref } from 'vue';

export const useCreateGame = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const createGame = async (
    maxPlayers: number,
    roundDuration: number,
    drawingsPerPlayer: number
  ) => {
    try {
      isSuccess.value = false;
      isLoading.value = true;
      const gameId = await GameApi.createGame(maxPlayers, roundDuration, drawingsPerPlayer);
      isSuccess.value = true;
      return gameId;
    } catch (error) {
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return { createGame, isLoading, isSuccess };
};
