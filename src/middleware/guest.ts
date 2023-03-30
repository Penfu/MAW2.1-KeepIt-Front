import type { GuardType } from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { RouteParamsRaw } from 'vue-router';

export default function guest({ to, next }: GuardType): void {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isAuth;
  if (isLoggedIn) {
    return next({
      name: (to.redirectedFrom?.name ?? 'home') as string,
      params: (to.redirectedFrom?.params ?? to.params) as RouteParamsRaw,
    });
  }

  return next();
}
