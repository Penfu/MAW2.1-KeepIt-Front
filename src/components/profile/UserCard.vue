<script setup lang="ts">
import router from '@/router';

import type User from '@/models/user';

defineProps<{
  user: User;
}>();
</script>

<template>
  <div class="p-4 space-y-4 bg-white rounded-lg lg:shadow-lg shadow-gray-300">
    <div
      @click="router.push({ name: 'profile', params: { id: user.id } })"
      class="flex flex-col md:flex-row items-center gap-4"
    >
      <img :src="user.avatar" class="w-32 rounded-lg shadow" />

      <div class="overflow-ellipsis truncate">
        <h2 class="text-xl font-bold">{{ user.username }}</h2>
        <span class="font-medium">{{ user.email }}</span>
      </div>
    </div>

    <slot />
  </div>
</template>
