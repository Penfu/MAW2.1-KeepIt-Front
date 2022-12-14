<script lang="ts">
import BookCard from '@/components/BookCard.vue';

export default {
  name: 'BooksView',
  components: {
    BookCard,
  },
  data() {
    return {
      books: [
        { id: 1, title: 'Book 1', like: 8, dislike: 2, release: '2022-01-01' },
        { id: 2, title: 'Book 2', like: 2, dislike: 8, release: '2022-02-02' },
        { id: 3, title: 'Book 3', like: 10, dislike: 10, release: '2022-03-03' },
        { id: 4, title: 'Book 4', like: 1000, dislike: 300000, release: '2022-04-04' },
        { id: 5, title: 'Book 5', like: 1000000, dislike: 20000, release: '2022-05-05' },
      ],
      search: '' as string,
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter((book) =>
        book.title.toLowerCase().includes(this.search.trim().toLowerCase())
      );
    },
  },
};
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
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>
  </main>
</template>
