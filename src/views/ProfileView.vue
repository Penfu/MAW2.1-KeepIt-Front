<script setup lang="ts">
import AchievementCard from '@/components/profile/AchievementCard.vue';
import { computed, ref, watch } from 'vue';
import Activities from './profile/ActivitiesView.vue';
import Friends from './profile/FriendsView.vue';
import Achievements from './profile/AchievementsView.vue';
import ActivityIcon from '@/components/icons/ActivityIcon.vue';
import FriendIcon from '@/components/icons/FriendIcon.vue';
import AchievementIcon from '@/components/icons/AchievementIcon.vue';
import UserCard from '@/components/profile/UserCard.vue';
import type User from '@/models/user';
import UserProvider from '@/providers/user';
import AchievementProvider from '@/providers/achievement';
import type Achievement from '@/models/achievement';
import ProfileEditView from './profile/ProfileEditView.vue';

const props = defineProps<{ id: string; class: string }>();
const user = ref<User | null>(null);
const achievements = ref<Achievement[]>([]);

const isUserLoading = computed(() => {
  return user.value === null;
});

watch(
  () => props.id,
  async (newId) => {
    user.value = null;
    user.value = await UserProvider.fetchUser(newId);
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
  <div>
    <div v-if="isUserLoading" class="pt-10 flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-800"
      ></div>
    </div>
    <div v-else class="pt-10">
      <div :class="class">
        <div class="flex flex-col md:flex-row md:items-start items-center">
          <div class="flex flex-row justify-center md:w-2/3">
            <UserCard
              :email="user?.email ?? ''"
              :name="user?.username ?? user?.email"
              :id="user?.id.toString() ?? ''"
            >
              <!-- <router-link
              :to="{
                name: 'profile-edit',
                params: { id: id },
              }"
              class="mt-5 text-sky-400 hover:text-sky-900 transition duration-500 ease-in-out"
            >
              Edit profile
            </router-link> -->
              <ProfileEditView :id="id" />
            </UserCard>
          </div>

          <div class="flex flex-col sm:w-2/3">
            <div class="grid md:grid-cols-2 gap-4 pr-5">
              <template v-for="achievement in achievements">
                <AchievementCard
                  :title="achievement.title"
                  :description="achievement.description"
                  :percentage="achievement.percentage"
                  :earned-date="achievement.earnedDate.toString()"
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
          <component
            :is="steps[step].component"
            v-model="props.id"
            :class="class"
          />
        </keep-alive>
      </div>
    </div>
  </div>
  <RouterView />
</template>
