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
  <main
    style="max-height: calc(100vh - 56px)"
    class="h-screen flex flex-col gap-4"
  >
    <div class="flex items-center">
      <div class="grow">
        <h1 class="text-xl font-semibold">Books</h1>
      </div>

      <!-- Search bar -->
      <div class="m-2 flex items-center bg-gray-100 rounded shadow drop-shadow">
        <input
          v-model="search"
          v-on:input="debouncedSearch"
          type="text"
          class="grow py-3 px-4 rounded-lg outline-none text-lg"
          placeholder="Search for a book..."
        />
      </div>
    </div>

    <!-- Book cards -->
    <MediaList
      :scroll-event="onScroll"
      :medias="(books as Book[])"
      :mediaCard="BookCard"
    />
  </main>
</template>
