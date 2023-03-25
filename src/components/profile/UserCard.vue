<script setup lang="ts">
import type User from '@/models/user';

defineProps<{
  user: User;
}>();
</script>

<template>
  <div class="p-4 space-y-4 bg-white rounded-lg lg:shadow-lg shadow-gray-300">
    <div class="flex flex-col md:flex-row items-center gap-4">
      <img :src="user.avatar" class="w-32 rounded-lg shadow" />

      <div>
        <h2 class="text-xl font-bold">{{ user.username }}</h2>
        <RouterLink
          :to="{
            name: 'profile',
            params: { id: user.id },
          }"
          class="font-medium text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
        >
          {{ user.email }}
        </RouterLink>
      </div>
    </div>

    <slot />
  </div>
</template>
