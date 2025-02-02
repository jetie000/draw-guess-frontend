import type { PublicUser } from './user.interface';

export interface Player {
  id: number;
  points: number;
  user: PublicUser;
}
