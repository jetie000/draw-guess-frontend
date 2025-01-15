import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useUserStore } from '@/stores/user/userStore';

export const router = createRouter({
  history: createWebHistory('/'),
  routes
});

const UnauthorizedRoutes = ['Login', 'SignUp', 'ResetPassword'];

router.beforeEach((to, from) => {
  const { token } = useUserStore();

  if (!token && !UnauthorizedRoutes.includes(to.name as string)) {
    router.push({ name: 'Login' });
  }
  if (token && UnauthorizedRoutes.includes(to.name as string)) {
    router.push({ name: 'Home' });
  }
});
