<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type User from '@/models/user';

import UserProvider from '@/providers/user';

import UserCard from '@/components/profile/UserCard.vue';

const users = ref<User[]>([]);

onMounted(async () => {
  users.value = await UserProvider.fetchUsers();
});
</script>

<template>
  <div class="container space-y-8">
    <h>Members</h>
    <div v-if="users.length !== 0">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserCard
          v-for="user in (users as User[])"
          :key="user.id"
          :user="user"
          class="cursor-pointer hover:bg-gray-100"
        />
      </div>
    </div>
  </div>
</template>
