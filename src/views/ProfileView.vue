<script setup lang="ts">
import AchievementCard from '@/components/profile/AchievementCard.vue';
import { computed, onMounted, onUpdated, ref, watch, watchEffect } from 'vue';
import Activities from './profile/Activities.vue';
import Friends from './profile/Friends.vue';
import Achievements from './profile/Achievements.vue';
import ActivityIcon from '@/components/icons/ActivityIcon.vue';
import FriendIcon from '@/components/icons/FriendIcon.vue';
import AchievementIcon from '@/components/icons/AchievementIcon.vue';
import UserCard from '@/components/profile/UserCard.vue';
import type User from '@/models/user';
import UserProvider from '@/providers/user';
import NotFoundView from './NotFoundView.vue';
import AchievementProvider from '@/providers/achievement';
import type Achievement from '@/models/achievement';

const props = defineProps<{ id: string }>();
const user = ref({} as User);
const achievements = ref([] as Achievement[]);

const isLoading = ref(true);
const notFound = ref(false);

watch(
  () => props.id,
  async (newId) => {
    isLoading.value = true;
    notFound.value = false;

    UserProvider.fetchUser(newId)
      .then((data) => {
        user.value = data;
        notFound.value = false;
      })
      .catch((err) => {
        user.value = {} as User;
        notFound.value = true;
      });

    isLoading.value = false;

    achievements.value = await AchievementProvider.fetchAchievements(4);
  },
  { immediate: true }
);
const step = ref(0);

const steps = [
  { component: Activities, title: 'Activities', icon: ActivityIcon },
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
  <div v-if="isLoading" class="pt-10 flex justify-center items-center">
    <div
      class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-800"
    ></div>
  </div>
  <div v-else>
    <component v-if="notFound" :is="NotFoundView"></component>
    <div v-else class="pt-10">
      <div class="flex flex-col md:flex-row md:items-start items-center">
        <div class="flex flex-row justify-center md:w-2/3">
          <UserCard
            :fullname="user.username ?? user.email"
            description="veniam ea excepturi "
          />
        </div>

        <div class="flex flex-col sm:w-2/3">
          <div class="grid md:grid-cols-2 gap-4 pr-5">
            <template v-for="achievement in achievements">
              <AchievementCard
                :title="achievement.title"
                :description="achievement.description"
                :percentage="achievement.percentage"
                :earned-date="achievement.earnedDate"
              />
            </template>
          </div>
          <p class="pt-5 text-center" v-if="achievements.length >= 4">
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

      <div class="py-2 border-b-2"></div>

      <div class="flex flex-col sm:flex-row justify-center sm:space-x-14 m-5">
        <button
          class="relative block p-4"
          v-for="(item, index) in steps"
          :key="item.title"
          @click="updateStepByTitle(item.title)"
          :id="`tab-${item.title}`"
        >
          <span
            v-if="isStepActive(index)"
            class="absolute inset-x-0 -bottom-px h-px w-full bg-pink-600"
          ></span>

          <div class="flex items-center justify-center gap-4">
            <component :is="item.icon" />
            <span class="text-sm font-medium text-gray-900">
              {{ item.title }}
            </span>
          </div>
        </button>
      </div>

      <keep-alive>
        <component :is="steps[step].component" />
      </keep-alive>
    </div>
  </div>
</template>
