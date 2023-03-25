<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type User from '@/models/user';

import FriendProvider from '@/providers/friend';
import type Invitation from '@/models/invitation';

const props = defineProps<{
  userId: number;
}>();

const invitations = ref<Invitation[]>([]);
const friends = ref<User[]>([]);

onMounted(async () => {
  invitations.value = await FriendProvider.fetchInvitations(props.userId);
  friends.value = await FriendProvider.fetchFriends(props.userId);
});

const handleAcceptInvitation = async (invitation: Invitation) => {
  try {
    await FriendProvider.acceptInvitation(invitation);
    invitations.value = invitations.value.filter((i) => i.id !== invitation.id);
    friends.value.push(invitation.author as User);
  } catch (error) {
    console.error(error);
  }
};

const handleRemoveFriend = async (friend: User) => {
  try {
    await FriendProvider.removeFriend(friend);
    friends.value = friends.value.filter((f) => f.id !== friend.id);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="space-y-8">
    <!-- Pending invitations -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-gray-700">Pending invitations</h2>
      <div class="flex">
        <div
          v-for="invitation in (invitations as Invitation[])"
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
          <button @click="handleAcceptInvitation(invitation)" class="btn">
            Accept
          </button>
        </div>
        <div v-if="invitations.length === 0" class="text-gray-500">
          No pending invitations
        </div>
      </div>
    </div>

    <!-- Friends -->
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-gray-700">Friends</h2>
      <div class="flex">
        <div
          v-for="friend in (friends as User[])"
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
      </div>
    </div>
  </div>
</template>
