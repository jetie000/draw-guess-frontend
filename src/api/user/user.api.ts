import type { AchievementsTypeIds } from '@/typings/enums/achievements';
import { userApiInstance } from '..';
import type {
  Achievement,
  LoginResponse,
  PatchUserRequest,
  PatchUserRequestAdmin,
  ProfileExtended
} from './user.api.interface';
import type { LeaderboardTypes } from '@/typings/enums/user';
import type { PublicLeaderboardUser } from '@/typings/interfaces/user.interface';

export const UserApi = {
  refreshToken: () => userApiInstance.get('/user/refresh-token').then((res) => res.data),
  logout: () => userApiInstance.post('/user/logout'),
  login: (email: string, password: string) =>
    userApiInstance.post<LoginResponse>('/user/login', { email, password }).then((res) => res.data),
  signUp: (email: string, username: string, password: string) =>
    userApiInstance.post('/user/sign-up', { email, username, password }),
  loginGoogle: (accessToken: string) =>
    userApiInstance
      .post<LoginResponse>('/user/login-google', { accessToken })
      .then((res) => res.data),
  requestCode: (email: string) => userApiInstance.get(`/user/request-code/${email}`),
  resetPassword: (email: string, code: string, password: string) =>
    userApiInstance.put('/user/reset-password', { email, code, password }),
  profile: () => userApiInstance.get<ProfileExtended>('/user/profile').then((res) => res.data),
  getAll: () => userApiInstance.get<ProfileExtended[]>('/user/all').then((res) => res.data),
  patchMe: (patchUserRequest: PatchUserRequest) =>
    userApiInstance.patch<LoginResponse>('/user/me', patchUserRequest).then((res) => res.data),
  patchUser: (patchUserRequest: PatchUserRequestAdmin) =>
    userApiInstance
      .patch<ProfileExtended>(`/user/${patchUserRequest.id}`, {
        ...patchUserRequest,
        password: patchUserRequest.password || undefined
      })
      .then((res) => res.data),
  getAchievements: () =>
    userApiInstance
      .get<{
        achievements: Achievement[];
        progressByType: Record<AchievementsTypeIds, number>;
      }>('/achievement/me')
      .then((res) => res.data),
  getLeaderboard: (type: LeaderboardTypes, days: number) =>
    userApiInstance
      .get<PublicLeaderboardUser[]>(`/user/leaderboard/${type}/${days}`)
      .then((res) => res.data)
};
