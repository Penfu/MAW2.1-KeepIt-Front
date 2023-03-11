import type { GuardType } from '@/router';
import { useAuthStore } from '@/stores/auth';

export default function auth({ to, from, next }: GuardType) {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuth;

  if (!isLoggedIn) {
    return next({
      name: 'login',
    });
  }

  return next();
}
