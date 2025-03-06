import type { UserRoles } from '@/typings/enums/user';

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
