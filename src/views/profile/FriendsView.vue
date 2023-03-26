<script setup lang="ts">
import type User from '@/models/user';

import FriendProvider from '@/providers/friend';
import type Invitation from '@/models/invitation';
import { useQuery, useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();

const props = defineProps<{
  userId: number;
}>();

const invitationsQuery = useQuery<Invitation[]>({
  queryKey: ['invitations', props.userId],
  queryFn: () => FriendProvider.fetchInvitations(props.userId),
});

const friendsQuery = useQuery<User[]>({
  queryKey: ['friends', props.userId],
  queryFn: () => FriendProvider.fetchFriends(props.userId),
});

const handleAcceptInvitation = async (invitation: Invitation) => {
  try {
    await FriendProvider.acceptInvitation(invitation);
    queryClient.setQueryData(
      ['invitations', props.userId],
      (oldData: Invitation[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((i: Invitation) => i.id !== invitation.id);
      }
    );
    queryClient.setQueryData(['friends', props.userId], (oldData: any) => {
      if (!oldData) return [];
      return [...oldData, invitation.author];
    });
  } catch (error) {
    invitationsQuery.refetch();
    friendsQuery.refetch();
  }
};

const handleDeclineInvitation = async (invitation: Invitation) => {
  try {
    await FriendProvider.declineInvitation(invitation);
    queryClient.setQueryData(
      ['invitations', props.userId],
      (oldData: Invitation[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((i: Invitation) => i.id !== invitation.id);
      }
    );
  } catch (error) {
    invitationsQuery.refetch();
  }
};

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
    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-gray-700">Pending invitations</h2>
      <!-- Loading -->
      <div
        v-if="invitationsQuery.isLoading.value"
        class="h-8 w-8 rounded-full border-b-2 border-cyan-800 animate-spin"
      ></div>
      <!-- Error -->
      <div v-else-if="invitationsQuery.isError.value" class="text-gray-500">
        Oops! Something went wrong.
      </div>

      <div class="flex" v-else>
        <div
          v-for="invitation in invitationsQuery.data.value"
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

          <div class="space-x-2">
            <button @click="handleDeclineInvitation(invitation)" class="btn">
              Decline
            </button>
            <button @click="handleAcceptInvitation(invitation)" class="btn">
              Accept
            </button>
          </div>
        </div>
        <div
          v-if="invitationsQuery.data.value?.length === 0"
          class="text-gray-500"
        >
          No pending invitations
        </div>
      </div>
    </div>

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
      </div>
    </div>
  </div>
</template>
