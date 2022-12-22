<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core'

import BookProvider from '@/providers/book';
import type Book from '@/models/book';

import BookCard from '@/components/BookCard.vue';

const books = ref([] as Book[]);
const search = ref('');
const offset = ref(0 as number);
const hasMore = ref(true as boolean);

const el = ref<HTMLElement>()

onMounted(async () => {
  books.value = await BookProvider.fetchBooks(12, offset.value);
});

useInfiniteScroll(
  el,
   async () => {
    if (!hasMore.value) {
      return;
    }

    console.log('Fetching more books... Offset: ' + offset.value);
    offset.value += 12;
    const newBooks = await BookProvider.fetchBooks(12, offset.value);
    books.value.push(...newBooks);

    hasMore.value = newBooks.length > 0;
  },
  { distance: 10 }
)
</script>

<template>
  <main class="h-screen my-4 space-y-8 overflow-y-hidden">
    <div class="flex items-center">
      <div class="grow">
        <h1 class="text-xl font-semibold">Books</h1>
      </div>

      <!-- Search bar -->
      <div class="flex items-center bg-white rounded shadow shadow-gray-300">
        <input v-model="search" type="text" class="grow py-3 px-4 rounded-lg outline-none text-lg"
          placeholder="Search for a book..." />
      </div>
    </div>

    <!-- Book cards -->
    <div class="h-full">
        <div ref="el"
        class="h-full overflow-y-scroll py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 justify-items-center">
        <BookCard v-for="book in books" :key="book.id" :book="(book as Book)" />
      </div>
    </div>
  </main>
</template>
