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
}

export interface ProfileExtended extends Profile {
  type: AccountTypes;
  access: boolean;
}

export interface PatchUserRequest {
  username: string;
}

export interface PatchUserRequestAdmin extends PatchUserRequest {
  id: number;
  role: UserRoles;
  access: boolean;
  password: string;
}
