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

          <div v-if="auth.isAuth" class="space-x-4">
            <span>Logged as user X</span>
            <button
              @click="auth.logout()"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
          <RouterLink v-else to="/login">Login</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
