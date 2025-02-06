import { gameApiInstance } from '..';
import type { Game } from './game.api.interface';

export const GameApi = {
  createGame: (
    maxPlayers: number,
    roundDuration: number,
    drawingsPerPlayer: number,
    isPrivate: boolean
  ) =>
    gameApiInstance
      .post<number>('/', {
        maxPlayers: Number(maxPlayers),
        roundDuration: Number(roundDuration),
        drawingsPerPlayer: Number(drawingsPerPlayer),
        isPrivate
      })
      .then((res) => res.data),
  joinGame: (code: string) =>
    gameApiInstance.post<number>('/join', { code }).then((res) => res.data),
  getGame: (gameId: number) => gameApiInstance.get<Game>(`/${gameId}`).then((res) => res.data),
  getParticipatingGames: (isEnded: boolean = false) =>
    gameApiInstance.get<Game[]>(`/participating?isEnded=${isEnded}`).then((res) => res.data),
  getPublicGames: () => gameApiInstance.get<Game[]>('/public').then((res) => res.data),
  deleteGame: (gameId: number) => gameApiInstance.delete(`/${gameId}`)
};
