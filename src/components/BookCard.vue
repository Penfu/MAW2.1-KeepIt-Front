<script lang="ts">
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  computed: {
    voteRatio() {
      return Math.round(
        (this.book.like / (this.book.like + this.book.dislike)) * 100
      );
    },
    readableLike() {
      return this.book.like.toLocaleString('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
      });
    },
    readableDislike() {
      return this.book.dislike.toLocaleString('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
      });
    },
    release() {
      return new Date(this.book.release).toLocaleDateString('fr-CH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    },
  },
};
</script>

<template>
  <RouterLink
    :to="'/books/' + book.id"
    class="flex flex-col h-80 w-56 bg-gray-100 rounded shadow shadow-gray-300 hover:cursor-pointer hover:scale-105 transition ease-in-out"
  >
    <div class="grow">
      <!-- Cover -->
    </div>

    <!-- Vote -->
    <div class="z-30 -mb-5 flex">
      <div
        class="group mx-2 p-2 w-14 h-10 hover:w-full flex bg-gray-800 text-white rounded cursor-default transition-width transition-slowest duration-300 ease-in-out"
      >
        <div class="mx-auto overflow-hidden">
          <span class="group-hover:hidden">{{ voteRatio }}%</span>
          <span class="hidden group-hover:block">
            {{ readableLike }}👍 {{ readableDislike }}👎
          </span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="z-20 px-4 py-8 bg-white rounded">
      <h2 class="font-bold">{{ book.title }}</h2>
      <p class="text-sm text-gray-500">{{ release }}</p>
    </div>
  </RouterLink>
</template>
