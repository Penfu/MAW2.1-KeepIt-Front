<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div>
    <header>
      <div>
        <nav>
          <RouterLink to="/">Home</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>
