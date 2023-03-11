import type { GuardType } from '@/router';
import { useAuthStore } from '@/stores/auth';

export default function guest({ to, from, next }: GuardType): void {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuth;
  if (isLoggedIn) {
    return next({
      name: (to.redirectedFrom ? to.redirectedFrom.name : 'login')?.toString(),
    });
  }

  return next();
}
