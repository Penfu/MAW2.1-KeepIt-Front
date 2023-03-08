<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type Book from '@/models/book';
import type Movie from '@/models/movie';

import BookProvider from '@/providers/book';
import MovieProvider from '@/providers/movie';

import BookCard from '@/components/media/BookCard.vue';
import MovieCard from '@/components/media/MovieCard.vue';

// Fetch books using named parameters
const books = ref([] as Book[]);

onMounted(async () => {
  books.value = await BookProvider.fetchBooks('', 5);
});
</script>

<template>
  <main>
    <!-- Discover Books -->
    <div class="space-y-8">
      <h1 class="text-4xl font-bold text-gray-800">Discover Books</h1>
      <div
        v-if="books.length !== 0"
        class="flex justify-center items-center gap-4"
      >
        <BookCard
          v-for="book in books"
          :key="book.id"
          :media="(book as Book)"
        />
      </div>
    </div>
    <!-- Discover Movies -->
  </main>
</template>
