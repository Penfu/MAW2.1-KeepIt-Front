import { createRouter, createWebHistory } from 'vue-router';

import NotFoundViewVue from '@/views/NotFoundView.vue';

import LoginView from '@/views/authentication/LoginView.vue';
import RegisterView from '@/views/authentication/RegisterView.vue';

import HomeView from '@/views/HomeView.vue';

import BooksView from '@/views/BooksView.vue';
import BookView from '@/views/BookView.vue';

import MovieView from '@/views/MovieView.vue';
import MoviesView from '@/views/MoviesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundViewVue,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
  ],
});

export default router;
