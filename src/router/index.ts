import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router';

import NotFoundViewVue from '@/views/NotFoundView.vue';
import LoginView from '@/views/authentication/LoginView.vue';
import RegisterView from '@/views/authentication/RegisterView.vue';
import HomeView from '@/views/HomeView.vue';
import BooksView from '@/views/BooksView.vue';
import BookView from '@/views/BookView.vue';
import MovieView from '@/views/MovieView.vue';
import MoviesView from '@/views/MoviesView.vue';
import MembersView from '@/views/MembersView.vue';
import ProfileView from '@/views/ProfileView.vue';

import middlewarePipeline from '@/middleware/middlewarePipeline';
import guest from '@/middleware/guest';

export type GuardType = {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundViewVue,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        middleware: [guest],
      },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users/:id',
      name: 'profile',
      component: ProfileView,
      props: true,
    },
    {
      path: '/books',
      name: 'books',
      component: BooksView,
      meta: {
        inNavbar: true,
      },
    },
    {
      path: '/books/:id',
      name: 'book',
      component: BookView,
      props: true,
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesView,
      meta: {
        inNavbar: true,
      },
    },
    {
      path: '/movies/:id',
      name: 'movie',
      component: MovieView,
      props: true,
    },
    {
      path: '/members',
      name: 'members',
      component: MembersView,
      meta: {
        inNavbar: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const middleware = to.meta.middleware as any[];
  const context = { to, from, next };

  // Check if no middlware on route
  if (!middleware) {
    return next();
  }

  middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
