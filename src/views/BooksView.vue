<script setup lang="ts">
import { onMounted, ref } from 'vue';

import debounce from 'debounce';

import BookProvider from '@/providers/book';
import type Book from '@/models/book';

import MediaList from '@/components/MediaList.vue';
import BookCard from '@/components/media/BookCard.vue';

const books = ref([] as Book[]);
const search = ref('');
const offset = ref(0 as number);
const hasMore = ref(true as boolean);

const debouncedSearch = debounce(async function () {
  console.log('Searching for books: ' + search.value);

  offset.value = 0;
  hasMore.value = true;
  books.value = await BookProvider.fetchBooks(search.value, 12, offset.value);
}, 500);

onMounted(async () => {
  books.value = await BookProvider.fetchBooks(search.value, 12, offset.value);
});

const onScroll = async () => {
  if (!hasMore.value) {
    return;
  }

  console.log('Fetching more books... Offset: ' + offset.value);
  offset.value += 12;
  const newBooks = await BookProvider.fetchBooks(
    search.value,
    12,
    offset.value
  );
  books.value.push(...newBooks);

  hasMore.value = newBooks.length > 0;
};
</script>

<template>
  <div
    style="max-height: calc(100vh - var(--h-navbar))"
    class="container h-screen flex flex-col gap-4"
  >
    <div class="flex justify-between">
      <h1>Books</h1>

      <!-- Search bar -->
      <input
        v-model="search"
        v-on:input="debouncedSearch"
        type="text"
        class="py-3 px-2 sm:px-4 rounded-lg text-lg border-2 border-gray-300"
        placeholder="Search for a book..."
      />
    </div>

    <!-- Book cards -->
    <MediaList
      :scroll-event="onScroll"
      :medias="(books as Book[])"
      :mediaCard="BookCard"
    />
  </div>
</template>
