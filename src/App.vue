<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>

<template>
  <div class="max-h-screen mx-12 xl:mx-auto max-w-6xl">
    <header class="py-4">
      <div>
        <nav class="flex">
          <div class="grow space-x-4">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/books">Books</RouterLink>
          </div>

          <span v-if="auth.isAuth">Logged as user X</span>
          <RouterLink v-else to="/login">Login</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
