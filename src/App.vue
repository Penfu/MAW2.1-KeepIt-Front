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
  <div class="mx-auto max-w-7xl">
    <header class="py-4">
      <div>
        <nav class="flex space-x-4">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/books">Books</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
