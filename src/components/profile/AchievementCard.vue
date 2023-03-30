<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  percentage: number;
  earnedDate: string;
}>();
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-md shadow-gray-300">
    <div class="h-full flex justify-between items-center">
      <div class="basis-3/4 h-full flex flex-col space-y-2">
        <h3 class="leading-none font-bold text-gray-900">
          {{ title }}
        </h3>
        <div class="grow">
          <span class="text-sm text-gray-500">
            {{ description }}
          </span>
        </div>
        <span class="italic text-gray-400">
          {{
            new Date(earnedDate).toLocaleDateString('fr-CH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          }}
        </span>
      </div>
      <div class="flex justify-end items-center text-green-500 font-bold">
        <div class="group relative flex justify-center">
          <span class="text-lg">{{ percentage }}%</span>
          <span
            class="absolute p-2 w-32 top-6 scale-0 bg-gray-800 rounded text-xs text-white group-hover:scale-100 transition-all"
          >
            Users who achieved this success ! ✨
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
