<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useAuthStore } from '@/stores/auth';
import type User from '@/models/user';
import FriendProvider from '@/providers/friend';
import FriendRequestsView from './FriendRequestsView.vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  userId: number;
}>();

const auth = useAuthStore();
const queryClient = useQueryClient();
const userId = ref(props.userId);

// Remove cache when profile switch
watch(
  () => props.userId,
  (newId) => {
    if (props.userId == userId.value) return;
    queryClient.invalidateQueries({
      queryKey: ['friends', userId],
    });
    userId.value = newId;
  },
  { immediate: true }
);

const friendsQuery = useQuery<User[]>({
  queryKey: ['friends', props.userId],
  queryFn: () => FriendProvider.fetchFriends(props.userId),
});

const setFriends = (friend: User) => {
  queryClient.setQueryData(['friends', props.userId], (oldData: any) => {
    if (!oldData) return [];
    return oldData.filter((f: User) => f.id !== friend.id);
  });
};

const { isLoading, mutate: removeFriend } = useMutation({
  mutationFn: async (friend: User) => await FriendProvider.removeFriend(friend),
  onError: () => friendsQuery.refetch(),
});

const handleRemoveFriend = async (friend: User) => {
  removeFriend(friend);
  setFriends(friend);
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
          <button
            v-if="auth.user?.id == userId"
            @click="handleRemoveFriend(friend)"
            class="btn"
          >
            Remove
            <!-- Spinner -->
            <svg
              v-if="isLoading"
              class="animate-spin h-5 w-5 ml-3 -mr-1 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </button>
        </div>
        <div v-if="friendsQuery.data.value?.length === 0" class="text-gray-500">
          No friends
        </div>
      </div>
    </div>
  </div>
</template>
