<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
  },
};
</script>

<template>
  <div class="max-h-screen mx-12 xl:mx-auto max-w-6xl">
    <header class="py-4">
      <div>
        <nav class="flex space-x-4">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/books">Books</RouterLink>
          <RouterLink to="/movies">Movies</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
