import type { GuardType } from '@/router';

export default function middlewarePipeline(
  context: GuardType,
  middleware: any,
  index: number
): {} {
  const nextMiddleware = middleware[index];

  if (!nextMiddleware) {
    return context.next;
  }

  return () => {
    nextMiddleware({
      ...context,
      next: middlewarePipeline(context, middleware, index + 1),
    });
  };
}
