import { gameApiInstance } from '..';

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
    gameApiInstance.post<number>('/join', { code }).then((res) => res.data)
};
