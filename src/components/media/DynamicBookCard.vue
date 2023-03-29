<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type Book from '@/models/book';

const props = defineProps<{
  media: Book;
}>();

const voteRatio = computed(
  () =>
    Math.round(
      (props.media.upvotes / (props.media.upvotes + props.media.downvotes)) *
        100
    ) || 0
);

const readableUpvotes = computed(() =>
  props.media.upvotes.toLocaleString('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  })
);

const readableDownvotes = computed(() =>
  props.media.downvotes.toLocaleString('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  })
);

const releaseDate = computed(() =>
  new Date(props.media.publishedAt).toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
);
</script>

<template>
  <RouterLink
    :to="'/books/' + media.id"
    class="flex md:flex-col h-20 md:h-80 w-full md:w-56 bg-gray-100 rounded-lg overflow-hidden shadow drop-shadow-lg hover:cursor-pointer hover:scale-105 transition ease-in-out"
  >
    <!-- Cover -->
    <img
      :src="media.cover"
      class="block w-32 sm:w-52 md:w-full md:h-40 object-cover"
      alt="Book cover"
    />

    <div class="grow w-full flex flex-row-reverse md:flex-col">
      <!-- Vote -->
      <div class="z-30 md:px-2 md:-mt-5 md:-mb-5">
        <div
          class="group w-14 h-full md:max-h-10 md:h-10 hover:w-28 md:hover:w-full flex items-center bg-gray-800 text-white rounded cursor-default transition-width transition-slowest duration-300 ease-in-out"
        >
          <div class="h-10 mx-auto flex items-center overflow-hidden">
            <span class="group-hover:hidden">{{ voteRatio }}%</span>
            <span class="hidden group-hover:block">
              {{ readableUpvotes }}👍 {{ readableDownvotes }}👎
            </span>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div
        class="z-20 h-full w-full md:w-auto px-4 md:pt-8 md:pb-4 flex flex-col justify-between"
      >
        <h2
          class="relative group h-full md:h-16 font-bold flex items-center md:block overflow-hidden text-ellipsis"
        >
          {{ media.title }}
        </h2>
        <p class="hidden md:block text-md text-gray-500">
          {{ releaseDate }}
        </p>
      </div>
    </div>
  </RouterLink>
</template>
