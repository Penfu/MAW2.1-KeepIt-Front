<script setup lang="ts">
import AchievementCard from '@/components/profile/AchievementCard.vue';
import type Achievement from '@/models/achievement';
import AchievementProvider from '@/providers/achievement';
import { ref, watch } from 'vue';

const achievements = ref([] as Achievement[]);
const props = defineProps<{ modelValue: string }>();
const isLoading = ref(true);

watch(
  () => props.modelValue,
  async (newId) => {
    isLoading.value = true;
    achievements.value = await AchievementProvider.fetchAchievements(
      10,
      0,
      newId
    );
    isLoading.value = false;
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="isLoading" class="pt-10 flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-800"
      ></div>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-4 pr-5">
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
