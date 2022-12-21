<script lang="ts">
import BookCard from '@/components/BookCard.vue';
import Book from '@/models/book';

export default{
  name: 'BooksView',
  components: {
    BookCard,
  },
  data() {
    return {
      books: [
        new Book('1', 'Book 1', '2022-01-01', 8, 2),
        new Book('2', 'Book 2', '2022-02-02', 2, 8),
        new Book('3', 'Book 3', '2022-03-03', 10, 10),
        new Book('4', 'Book 4', '2022-04-04', 1000, 300000),
        new Book('5', 'Book 5', '2022-05-05', 1000000, 20000),
      ],
      search: '',
    };
  },
  computed: {
    filteredBooks() {
      return this.books.filter((book) => book.title.trim().toLowerCase().includes(this.search.trim().toLowerCase()));
    },
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
      <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
    </div>
  </main>
</template>
