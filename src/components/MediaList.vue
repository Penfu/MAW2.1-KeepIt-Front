<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';

import type Media from '@/models/media';

const props = defineProps<{
  scrollEvent: Function;
  medias: Media[];
  mediaCard: any;
}>();

const el = ref<HTMLElement>();

useInfiniteScroll(
  el,
  async () => {
    props.scrollEvent();
  },
  { distance: 500 }
);
</script>

<template>
  <!-- Media cards -->
  <div class="h-full px-4 overflow-y-hidden">
    <div
      ref="el"
      class="h-full overflow-y-scroll py-4 grid grid-cols sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 justify-items-center"
    >
      <component
        :is="mediaCard"
        v-for="media in medias"
        :media="(media as Media)"
        :key="media.id"
      />
    </div>
  </div>
</template>
