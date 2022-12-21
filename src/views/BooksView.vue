<script lang="ts">
import BookProvider from '@/providers/book';
import type Book from '@/models/book';

import BookCard from '@/components/BookCard.vue';

export default{
  name: 'BooksView',
  components: {
    BookCard,
  },
  data() {
    return {
      books: [] as Book[],
      search: '',
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter((book) => book.title.trim().toLowerCase().includes(this.search.trim().toLowerCase()));
    },
  },
  async created() {
    this.books = await BookProvider.fetchBooks(12);
  },
}
</script>

<template>
  <main class="my-4">
    <div class="flex items-center">
      <div class="grow">
        <h1 class="text-xl font-semibold">Books</h1>
      </div>

      <!-- Search bar -->
      <div class="flex items-center bg-white rounded shadow shadow-gray-300">
        <input
          v-model="search"
          type="text"
          class="grow py-3 px-4 rounded-lg outline-none text-lg"
          placeholder="Search for a book..."
        />
      </div>
    </div>

    <div
      class="my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 justify-items-center"
    >
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="(book as Book)" />
    </div>
  </main>
</template>
