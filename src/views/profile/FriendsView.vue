<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';

import type User from '@/models/user';

import FriendProvider from '@/providers/friend';

import FriendRequestsView from './FriendRequestsView.vue';

const props = defineProps<{
  userId: number;
}>();

const auth = useAuthStore();
const queryClient = useQueryClient();

const friendsQuery = useQuery<User[]>({
  queryKey: ['friends', props.userId],
  queryFn: () => FriendProvider.fetchFriends(props.userId),
});

const handleRemoveFriend = async (friend: User) => {
  try {
    await FriendProvider.removeFriend(friend);
    queryClient.setQueryData(['friends', props.userId], (oldData: any) => {
      if (!oldData) return [];
      return oldData.filter((f: User) => f.id !== friend.id);
    });
  } catch (error) {
    friendsQuery.refetch();
  }
};
</script>

<template>
  <div class="space-y-8">
    <!-- Pending invitations -->
    <FriendRequestsView
      v-if="auth.user?.id === props.userId"
      :userId="props.userId"
    />

    <!-- Friends -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-gray-700">Friends</h2>
      <!-- Loading -->
      <div
        v-if="friendsQuery.isLoading.value"
        class="h-8 w-8 rounded-full border-b-2 border-cyan-800 animate-spin"
      ></div>
      <!-- Errors -->
      <div v-else-if="friendsQuery.error.value" class="text-gray-500">
        Oops! Something went wrong.
      </div>

      <div class="flex" v-else>
        <div
          v-for="friend in friendsQuery.data.value"
          :key="friend.id"
          class="px-4 py-2 flex items-center justify-between gap-8 bg-gray-100 rounded-lg shadow-md"
        >
          <div class="grow flex items-center space-x-2">
            <img
              class="h-12 w-12 rounded-full object-cover"
              :src="friend?.avatar"
            />
            <h2 class="text-lg font-semibold text-gray-700">
              {{ friend?.username }}
            </h2>
          </div>
          <button @click="handleRemoveFriend(friend)" class="btn">
            Remove
          </button>
        </div>
        <div v-if="friendsQuery.data.value?.length === 0" class="text-gray-500">
          No friends
        </div>
      </div>
    </div>
  </div>
</template>
