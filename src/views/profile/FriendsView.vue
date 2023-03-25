<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type User from '@/models/user';

import FriendProvider from '@/providers/friend';
import type Invitation from '@/models/invitation';

const props = defineProps<{
  userId: number;
}>();

const invitations = ref([] as Invitation[]);
const friends = ref([] as User[]);

onMounted(async () => {
  invitations.value = await FriendProvider.fetchInvitations(props.userId);
  friends.value = await FriendProvider.fetchFriends(props.userId);
});
</script>

<template>
  <div>
    <!-- Pending invitations -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-gray-700">Pending invitations</h2>
      <div class="flex">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="px-4 py-2 flex items-center justify-between gap-8 bg-gray-100 rounded-lg shadow-md"
        >
          <div class="grow flex items-center space-x-2">
            <img
              class="h-12 w-12 rounded-full object-cover"
              :src="invitation.author?.avatar"
            />
            <h2 class="text-lg font-semibold text-gray-700">
              {{ invitation.author?.username }}
            </h2>
          </div>
          <button class="btn">Accept</button>
        </div>
      </div>
    </div>

    <!-- Friends -->
    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="friend in friends"
        :key="friend.id"
        class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
      >
        <div class="flex items-center">
          <img
            class="h-12 w-12 rounded-full object-cover"
            :src="friend.avatar"
          />
          <div class="ml-4">
            <h2 class="text-lg font-semibold text-gray-700">
              {{ friend.username }}
            </h2>
            <h3 class="text-sm font-medium text-gray-500">
              {{ friend.email }}
            </h3>
          </div>
        </div>
        <div class="flex items-center">
          <button
            class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <svg
              class="h-6 w-6 text-gray-600"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
