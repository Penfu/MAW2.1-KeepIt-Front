<script setup lang="ts">
import { computed, ref } from 'vue';
import AchievementProvider from '@/providers/achievement';
import AchievementCard from '@/components/profile/AchievementCard.vue';
import ThePagination from '@/components/ThePagination.vue';
import { useQuery } from '@tanstack/vue-query';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const offset = ref(1);
const max = ref(8);
const isLoading = computed(() => {
  return (
    achievementsQuery.isLoading.value || totalAchievementsQuery.isLoading.value
  );
});
const isError = computed(() => {
  return (
    achievementsQuery.isError.value || totalAchievementsQuery.isError.value
  );
});

const achievementsFetcher = (offset: number) =>
  AchievementProvider.fetchAchievements(props.userId, max.value, offset).then(
    (res) => res.items
  );

const achievementsQuery = useQuery({
  queryKey: ['achievements', offset],
  queryFn: () => achievementsFetcher(offset.value),
  keepPreviousData: true,
});

const totalAchievementsQuery = useQuery({
  queryKey: ['achievements-count', props.userId],
  queryFn: () => AchievementProvider.fetchCount(props.userId),
});

const paginate = async (newOffset: number) => {
  if (!achievementsQuery.isPreviousData.value) {
    offset.value = newOffset;
  }
};
</script>

<template>
  <div>
    <div v-if="isLoading" class="pt-10 flex justify-center items-center">
      <div
        class="h-32 w-32 rounded-full border-b-2 border-cyan-800 animate-spin"
      ></div>
    </div>
    <div v-else-if="isError" class="pt-10 flex justify-center items-center">
      <div class="text-center">
        <p class="text-2xl font-bold">Oops!</p>
        <p class="text-xl">Something went wrong.</p>
      </div>
    </div>
    <div v-else class="grid md:grid-cols-2 gap-4 flex">
      <AchievementCard
        v-for="achievement in achievementsQuery.data.value"
        :key="achievement.id"
        :title="achievement.title"
        :description="achievement.description"
        :percentage="achievement.percentage"
        :earned-date="achievement.earnedDate"
      />
      <div class="md:col-span-2">
        <ThePagination
          :total-articles="Number(totalAchievementsQuery.data.value)"
          :articles-per-page="max"
          :current-page="offset"
          @paginate="paginate"
        />
      </div>
    </div>
  </div>
</template>
