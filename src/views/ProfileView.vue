<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import router from '@/router';

import type User from '@/models/user';
import type Achievement from '@/models/achievement';

import { useAuthStore } from '@/stores/auth';

import UserProvider from '@/providers/user';
import FriendProvider from '@/providers/friend';
import AchievementProvider from '@/providers/achievement';

import Friends from '@/views/profile/FriendsView.vue';
import Achievements from '@/views/profile/AchievementsView.vue';
import ProfileEditView from '@/views/profile/ProfileEditView.vue';

import FriendIcon from '@/components/icons/FriendIcon.vue';
import AchievementCard from '@/components/profile/AchievementCard.vue';
import AchievementIcon from '@/components/icons/AchievementIcon.vue';
import UserCard from '@/components/profile/UserCard.vue';
import NotFoundException from '@/exceptions/notFoundException';

const props = defineProps<{
  id: string;
}>();

const auth = useAuthStore();

const user = ref<User>();
const achievements = ref<Achievement[]>([]);

const isUserLoading = computed(() => {
  return user.value === null;
});

const canInvite = computed(() => {
  return auth.isAuth && auth.user?.id != props.id;
});

watch(
  () => props.id,
  async (newId) => {
    try {
      user.value = await UserProvider.fetchUser(newId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        router.push({ name: 'not-found' });
      }
    }

    achievements.value = (
      await AchievementProvider.fetchAchievements(newId, 4, 1)
    ).items;
  },
  { immediate: true }
);

const step = ref(0);

const steps = [
  { component: Friends, title: 'Friends', icon: FriendIcon },
  { component: Achievements, title: 'Achievements', icon: AchievementIcon },
];

const isStepActive = (index: number) => {
  return step.value === index;
};

const updateStepByTitle = (title: string) => {
  const index = steps.findIndex((step) => step.title === title);
  step.value = index;
};
</script>

<template>
  <main class="py-8 space-y-12">
    <div
      v-if="!isUserLoading"
      class="flex flex-col lg:flex-row justify-between lg:items-start items-center gap-8"
    >
      <div class="lg:w-2/4">
        <UserCard v-if="user" :user="user">
          <ProfileEditView :id="id" />

          <div v-if="canInvite" class="flex justify-end">
            <!-- This user sent you a friend request -->
            <button
              v-if="user!.sentInvitation"
              class="btn flex items-center space-x-4"
            >
              Accept
            </button>

            <!-- You sent this user a friend request -->
            <button
              v-else-if="user!.receivedInvitation"
              @click="
                async () => await FriendProvider.cancelInvitation(user! as User)
              "
              class="btn flex items-center space-x-4"
            >
              Cancel invitation
            </button>

            <!-- You are not friends with this user and there is no pending request -->
            <button
              v-else-if="!user!.friendship"
              @click="
                async () => await FriendProvider.sendInvitation(user! as User)
              "
              class="btn flex items-center space-x-4"
            >
              Invite
            </button>

            <!-- You are friends with this user -->
            <button
              @click="
                async () => await FriendProvider.removeFriend(user! as User)
              "
              v-else
              class="btn flex items-center space-x-4"
            >
              Remove friend
            </button>
          </div>
        </UserCard>
      </div>

      <div class="sm:w-2/3 flex flex-col space-y-8">
        <div class="grid md:grid-cols-2 gap-4">
          <AchievementCard
            v-for="achievement in achievements"
            :key="achievement.id"
            :title="achievement.title"
            :description="achievement.description"
            :percentage="achievement.percentage"
            :earned-date="achievement.earnedDate"
          />
        </div>
        <p class="text-center" v-if="achievements.length >= 4">
          <a
            class="text-sky-400 hover:text-sky-900 transition duration-500 ease-in-out"
            href="#tab-Achievements"
            @click="updateStepByTitle('Achievements')"
          >
            See more
          </a>
        </p>
      </div>
    </div>

    <hr />

    <!-- Tabs menu -->
    <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-16">
      <button
        v-for="(item, index) in steps"
        :key="item.title"
        :id="`tab-${item.title}`"
        @click="updateStepByTitle(item.title)"
        class="py-2 border-b-2"
        :class="{
          'border-pink-600 transition-all duration-500': isStepActive(index),
        }"
      >
        <div class="flex items-center justify-center gap-4">
          <component :is="item.icon" />
          <span class="font-medium text-gray-900">
            {{ item.title }}
          </span>
        </div>
      </button>
    </div>

    <!-- Selected tab content -->
    <keep-alive>
      <component :is="steps[step].component" :userId="Number(props?.id)" />
    </keep-alive>
  </main>
</template>
