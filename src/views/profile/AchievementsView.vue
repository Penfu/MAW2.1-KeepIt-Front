<script setup lang="ts">
import { onMounted, ref } from 'vue';

import AchievementProvider from '@/providers/achievement';

import type Achievement from '@/models/achievement';

import AchievementCard from '@/components/profile/AchievementCard.vue';
import ThePagination from '@/components/ThePagination.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const achievements = ref([] as Achievement[]);
const offset = ref(1);
const max = ref(8);
const totalAchievements = ref(0);
const isLoading = ref(true);
console.log(totalAchievements.value);

const fetcher = async () => {
  const response = await AchievementProvider.fetchAchievements(
    props.userId,
    max.value,
    offset.value
  );
  achievements.value = response.items;
  isLoading.value = false;
};

const paginate = async (newOffset: number) => {
  offset.value = newOffset;
  await fetcher();
};

onMounted(async () => {
  await fetcher();
  totalAchievements.value = await AchievementProvider.fetchCount(props.userId);
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
    <div v-else class="grid md:grid-cols-2 gap-4 flex">
      <AchievementCard
        v-for="achievement in achievements"
        :key="achievement.id"
        :title="achievement.title"
        :description="achievement.description"
        :percentage="achievement.percentage"
        :earned-date="achievement.earnedDate"
      />
      <div class="col-span-2">
        <ThePagination
          :total-articles="totalAchievements"
          :articles-per-page="max"
          :current-page="offset"
          @paginate="paginate"
        />
      </div>
    </div>
  </div>
</template>
