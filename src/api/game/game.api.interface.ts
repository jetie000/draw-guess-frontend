export interface Game {
  id: number;
  code: string;
  maxPlayers: number;
  roundDuration: number;
  drawingsPerPlayer: number;
  players: {
    id: number;
    username: string;
    avatarUrl: string;
  }[];
}
