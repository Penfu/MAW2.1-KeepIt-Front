<script lang="ts">
import BookCard from "@/components/BookCard.vue";

export default {
  name: "BooksView",
  components: {
    BookCard,
  },
  data() {
    return {
      books: [
        { id: 1, title: "Book 1", like: 8, dislike: 2, release: "2022-01-01" },
        { id: 2, title: "Book 2", like: 2, dislike: 8, release: "2022-02-02" },
        { id: 3, title: "Book 3", like: 100, dislike: 10, release: "2022-03-03" },
        { id: 4, title: "Book 4", like: 10000, dislike: 300000, release: "2022-04-04" },
        { id: 5, title: "Book 5", like: 10000000, dislike: 20000, release: "2022-05-05" },
      ],
    };
  },
};
</script>

<template>
  <main class="my-4">
    <h1 class="text-xl font-semibold">Books</h1>
    <div
      class="my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 justify-items-center"
    >
      <BookCard v-for="book in books" :key="book.id" :book="book" />
    </div>
  </main>
</template>
