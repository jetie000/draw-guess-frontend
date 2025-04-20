import type { Player } from '@/typings/interfaces/player.interface';
import type { Drawing, Word, WordType } from '../drawing/drawing.api.interface';

export interface GameDrawing extends Required<Drawing> {
  gamePlayer: Player;
}

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
  wordTypes: WordType[];
  drawings: GameDrawing[] | null;
}
