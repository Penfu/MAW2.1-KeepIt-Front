<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type Book from '@/models/book';
import BookProvider from '@/providers/book';

import BookCard from '@/components/media/BookCard.vue';

const book = ref({} as Book);

onMounted(async () => {
  book.value = (await BookProvider.fetchBooks('404 Not Found'))[0];
});
</script>

<template>
  <main>
    <div class="py-32 flex flex-col justify-center items-center space-y-12">
      <div
        class="h-32 text-center md:text-left flex flex-col space-y-4 text-3xl font-semibold"
      >
        <h2>The page you are looking for does not exist.</h2>
        <h3 v-show="book.id">You can still read this book...</h3>
      </div>

      <BookCard v-if="book.id" :media="(book as Book)" />
      <div v-else class="h-80 w-56 bg-gray-100 rounded-xl animate-pulse"></div>
    </div>
  </main>
</template>
