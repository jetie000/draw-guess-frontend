import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/HomePage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/LoginPage.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('@/views/Auth/SignUpPage.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/Auth/ResetPasswordPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];
