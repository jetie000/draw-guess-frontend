export interface PublicUser {
  id: number;
  avatarUrl?: string;
  username: string;
  experience: number;
}

export interface PublicLeaderboardUser extends PublicUser {
  points?: number;
  wins?: number;
  wordsGuessed?: number;
}
