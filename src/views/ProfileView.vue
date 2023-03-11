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
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{ id: string; class: string }>();
const user = ref<User | null>(null);
const AuthStore = useAuthStore();
const achievements = ref<Achievement[]>([]);
const userCardProps = computed(() => {
  return {
    id: user.value?.id,
    email: user.value?.email,
    name: user.value?.username,
  };
});

const isUserLoading = computed(() => {
  return user.value === null;
});

watch(
  () => AuthStore.user,
  async (newUser) => {
    if (newUser?.id == props.id) {
      // TODO: when the bug with jwt refresh will be fixed
      // remove fetch user and instead use the user from the store (AuthStore.user)
      user.value = await UserProvider.fetchUser(newUser?.id);
    }
  },
  { immediate: true }
);

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
      <div :class="props.class">
        <div class="flex flex-col md:flex-row md:items-start items-center">
          <div class="flex flex-row justify-center md:w-2/3">
            <UserCard
              :email="userCardProps.email"
              :name="userCardProps.name || ''"
              :id="userCardProps.id"
            >
              <ProfileEditView :id="id" />
            </UserCard>
          </div>

          <div class="flex flex-col sm:w-2/3">
            <div class="grid md:grid-cols-2 gap-4 pr-5">
              <!-- <template > -->
              <AchievementCard
                v-for="achievement in achievements"
                :key="achievement.id"
                :title="achievement.title"
                :description="achievement.description"
                :percentage="achievement.percentage"
                :earned-date="achievement.earnedDate.toString()"
              />
              <!-- </template> -->
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
            :v-model="props.id"
            :class="props.class"
          />
        </keep-alive>
      </div>
    </div>
  </div>
  <RouterView />
</template>
