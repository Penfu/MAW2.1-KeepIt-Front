<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  percentage: number;
}>();
</script>

<template>
  <div class="bg-white shadow-xl rounded-lg p-4 sm:p-2">
    <div class="flex items-center flex-row">
      <div class="flex-shrink-1">
        <span class="text-base leading-none font-bold text-gray-900">{{
          title
        }}</span>
        <h3 class="text-xs font-normal text-gray-500">
          {{ description }}
        </h3>
      </div>
      <div
        class="ml-5 flex items-center justify-end flex-1 text-green-500 text-base font-bold"
      >
        <div class="group relative flex justify-center">
          {{ percentage }}%
          <span
            class="absolute top-6 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-32"
            >Users who achieved this success ! ✨
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
