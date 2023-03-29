<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type Book from '@/models/book';
import type Movie from '@/models/movie';

import BookProvider from '@/providers/book';
import MovieProvider from '@/providers/movie';

import DynamicMediaCard from '@/components/media/DynamicMediaCard.vue';
import DynamicMediaSkeletonCard from '@/components/media/DynamicMediaSkeletonCard.vue';

const books = ref<Book[]>([]);
const movies = ref<Movie[]>([]);

onMounted(async () => {
  [books.value, movies.value] = await Promise.all([
    BookProvider.fetchBooks('', 5),
    MovieProvider.fetchMovies('', 1, 5),
  ]);
});
</script>

<template>
  <div class="container space-y-16">
    <!-- Discover Books -->
    <div class="space-y-8">
      <h1>Discover Books</h1>
      <div class="flex flex-col md:flex-row justify-center items-center gap-4">
        <DynamicMediaCard
          v-for="book in books"
          :key="book.id"
          :media="(book as Book)"
        />
        <template v-if="books.length == 0">
          <DynamicMediaSkeletonCard v-for="i in 5" :key="i" />
        </template>
      </div>
    </div>

    <!-- Discover Movies -->
    <div class="space-y-8">
      <h1>Discover Movies</h1>
      <div class="flex flex-col md:flex-row justify-center items-center gap-4">
        <DynamicMediaCard
          v-for="movie in movies"
          :key="movie.id"
          :media="(movie as Movie)"
        />
        <template v-if="movies.length == 0">
          <DynamicMediaSkeletonCard v-for="i in 5" :key="i" />
        </template>
      </div>
    </div>
  </div>
</template>
