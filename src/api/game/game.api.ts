import { gameApiInstance } from '..';
import type { Game } from './game.api.interface';

export const GameApi = {
  createGame: (maxPlayers: number, roundDuration: number, drawingsPerPlayer: number) =>
    gameApiInstance
      .post<number>('/', {
        maxPlayers: Number(maxPlayers),
        roundDuration: Number(roundDuration),
        drawingsPerPlayer: Number(drawingsPerPlayer)
      })
      .then((res) => res.data),
  joinGame: (code: string) =>
    gameApiInstance.post<number>('/join', { code }).then((res) => res.data),
  getGame: (gameId: number) => gameApiInstance.get<Game>(`/${gameId}`).then((res) => res.data)
};
