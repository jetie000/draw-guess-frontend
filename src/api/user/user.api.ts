import { userApiInstance } from '..';
import type { LoginResponse } from './user.api.interface';

export const UserApi = {
  login: (email: string, password: string) =>
    userApiInstance.post<LoginResponse>('/login', { email, password }).then((res) => res.data),
  signUp: (email: string, username: string, password: string) =>
    userApiInstance.post('/sign-up', { email, username, password }),
  loginGoogle: (accessToken: string) =>
    userApiInstance.post<LoginResponse>('/login-google', { accessToken }).then((res) => res.data),
  requestCode: (email: string) => userApiInstance.get(`/request-code/${email}`),
  resetPassword: (email: string, code: string, password: string) =>
    userApiInstance.put('/reset-password', { email, code, password })
};
