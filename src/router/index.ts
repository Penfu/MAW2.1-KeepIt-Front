import { createRouter, createWebHistory } from 'vue-router';

import NotFoundViewVue from '@/views/NotFoundView.vue';

import HomeView from '../views/HomeView.vue';
import BooksView from '../views/BooksView.vue';
import BookView from '../views/BookView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundViewVue,
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
    },
    {
      path: '/books/:id',
      name: 'book',
      component: BookView,
      props: true,
    },
  ],
});

export default router;
