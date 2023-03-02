<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type Book from '@/models/book';

const props = defineProps<{
  book: Book;
}>();

const voteRatio = computed(() =>
  Math.round(
    (props.book.upvotes / (props.book.upvotes + props.book.downvotes)) * 100
  )
);

const readableUpvotes = computed(() =>
  props.book.upvotes.toLocaleString('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  })
);

const readableDownvotes = computed(() =>
  props.book.downvotes.toLocaleString('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  })
);

const releaseDate = computed(() =>
  new Date(props.book.publishedAt).toLocaleDateString('fr-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
);
</script>

<template>
  <RouterLink
    :to="'/books/' + book.id"
    class="flex flex-col h-80 w-56 bg-white rounded-xl shadow-md cursor-pointer hover:scale-105 transition ease-in-out"
  >
    <!-- Cover -->
    <div class="grow h-48 rounded-t-xl">
      <img
        :src="book.cover || '/assets/placeholder.png'"
        class="h-full w-full object-cover rounded-t-xl"
        alt="Book cover"
      />
    </div>

    <!-- Vote -->
    <div class="z-30 -mt-5 -mb-5 flex">
      <div
        class="group mx-2 p-2 w-14 h-10 hover:w-full flex bg-gray-800 text-white rounded cursor-default transition-width transition-slowest duration-300 ease-in-out"
      >
        <div class="mx-auto overflow-hidden">
          <span class="group-hover:hidden">{{ voteRatio }}%</span>
          <span class="hidden group-hover:block">
            {{ readableUpvotes }}👍 {{ readableDownvotes }}👎
          </span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="z-20 px-4 pt-8 pb-4 h-32 flex flex-col space-y-2">
      <h2 class="relative group grow text-ellipsis overflow-hidden font-bold">
        {{ book.title }}
      </h2>
      <p class="text-sm text-gray-500">
        {{ releaseDate }}
      </p>
    </div>
  </RouterLink>
</template>
