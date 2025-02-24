import type { Player } from '@/typings/interfaces/player.interface';

export interface Game {
  id: number;
  code: string;
  maxPlayers: number;
  roundDuration: number;
  drawingsPerPlayer: number;
  isPrivate: boolean;
  currentRound: number;
  creatorId: number;
  startDate: string | null;
  endDate: string | null;
  players: Player[];
}
