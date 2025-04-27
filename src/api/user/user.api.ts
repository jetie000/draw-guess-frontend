import { userApiInstance } from '..';
import type {
  LoginResponse,
  PatchUserRequest,
  PatchUserRequestAdmin,
  ProfileExtended
} from './user.api.interface';

export const UserApi = {
  refreshToken: () => userApiInstance.get('/refresh-token').then((res) => res.data),
  logout: () => userApiInstance.post('/logout'),
  login: (email: string, password: string) =>
    userApiInstance.post<LoginResponse>('/login', { email, password }).then((res) => res.data),
  signUp: (email: string, username: string, password: string) =>
    userApiInstance.post('/sign-up', { email, username, password }),
  loginGoogle: (accessToken: string) =>
    userApiInstance.post<LoginResponse>('/login-google', { accessToken }).then((res) => res.data),
  requestCode: (email: string) => userApiInstance.get(`/request-code/${email}`),
  resetPassword: (email: string, code: string, password: string) =>
    userApiInstance.put('/reset-password', { email, code, password }),
  profile: () => userApiInstance.get<ProfileExtended>('/profile').then((res) => res.data),
  getAll: () => userApiInstance.get<ProfileExtended[]>('/all').then((res) => res.data),
  patchMe: (patchUserRequest: PatchUserRequest) =>
    userApiInstance.patch<LoginResponse>('/me', patchUserRequest).then((res) => res.data),
  patchUser: (patchUserRequest: PatchUserRequestAdmin) =>
    userApiInstance
      .patch<ProfileExtended>(`/${patchUserRequest.id}`, {
        ...patchUserRequest,
        password: patchUserRequest.password || undefined
      })
      .then((res) => res.data)
};
