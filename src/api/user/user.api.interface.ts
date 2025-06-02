import type { AccountTypes, UserRoles } from '@/typings/enums/user';

export interface LoginResponse {
  accessToken: string;
}

export interface Profile {
  id: number;
  email: string;
  username: string;
  joinDate: string;
  loginDate: string;
  avatarUrl?: string;
  role: UserRoles;
  experience: number;
}

export interface ProfileExtended extends Profile {
  type: AccountTypes;
  access: boolean;
  money: number;
}

export interface PatchUserRequest {
  username: string;
}

export interface PatchUserRequestAdmin extends PatchUserRequest {
  id: number;
  role: UserRoles;
  access: boolean;
  password: string;
  type: AccountTypes;
}

export interface AchievementType {
  id: number;
  name: string;
  description: string;
  level1Amount: number;
  level2Amount: number;
  level3Amount: number;
}

export interface Achievement {
  id: number;
  typeId: number;
  userId: number;
  level: number;
  type: AchievementType;
}

export interface AchievementWithMoneyEarned extends Achievement {
  money: number;
}
