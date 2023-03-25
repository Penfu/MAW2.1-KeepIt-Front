<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AchievementProvider from '@/providers/achievement';

import type Achievement from '@/models/achievement';

import AchievementCard from '@/components/profile/AchievementCard.vue';

const props = defineProps<{
  userId: number;
}>();

const achievements = ref([] as Achievement[]);
const isLoading = ref(true);

onMounted(async () => {
  achievements.value = await AchievementProvider.fetchAchievements(
    10,
    0,
    props.userId
  );
  isLoading.value = false;
});
</script>

<template>
  <div>
    <div v-if="isLoading" class="pt-10 flex justify-center items-center">
      <div
        class="h-32 w-32 rounded-full border-b-2 border-cyan-800 animate-spin"
      ></div>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-4">
      <AchievementCard
        v-for="achievement in achievements"
        :key="achievement.id"
        :title="achievement.title"
        :description="achievement.description"
        :percentage="achievement.percentage"
        :earned-date="achievement.earnedDate.toString()"
      />
    </div>
  </div>
</template>
