<script setup lang="ts">
import { computed } from 'vue';
import PreviousIcon from '@/components/icons/PreviousIcon.vue';
import NextIcon from './icons/NextIcon.vue';

const props = defineProps<{
  articlesPerPage: number;
  totalArticles: number;
  currentPage: number;
}>();

defineEmits<{
  paginate: (pageNumber: number) => void;
}>();

const pageNumbers = computed(() => {
  const numbers = [];
  for (
    let i = 1;
    i <= Math.ceil(props.totalArticles / props.articlesPerPage);
    i++
  ) {
    numbers.push(i);
  }
  return numbers;
});

const pageNumbersToShow = computed(() => {
  const numbers = [];
  if (pageNumbers.value.length) {
    let showMax = 5;
    let endPage;
    let startPage;

    if (pageNumbers.value.length <= showMax) {
      startPage = 1;
      endPage = pageNumbers.value.length;
    } else {
      startPage = props.currentPage <= 3 ? 1 : props.currentPage - 3;
      if (
        props.currentPage != pageNumbers.value.length &&
        props.currentPage + 1 != pageNumbers.value.length
      ) {
        endPage = startPage + showMax - 1;
      } else {
        endPage = pageNumbers.value.length;
      }
    }

    endPage = Math.min(endPage, pageNumbers.value.length);
    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }
  }
  return numbers;
});
</script>

<template>
  <div
    aria-label="Pagination"
    class="flex text-gray-600 flex-grow items-center justify-center"
  >
    <a
      v-if="currentPage > 1"
      class="p-2 mr-4 rounded hover:bg-sky-100 cursor-pointer"
      @click="$emit('paginate', currentPage - 1)"
    >
      <PreviousIcon />
    </a>

    <template v-if="pageNumbersToShow.indexOf(1) < 0">
      <a
        class="px-4 py-2 rounded hover:bg-sky-100 cursor-pointer"
        @click="$emit('paginate', 1)"
        >1</a
      >
      <a
        v-if="currentPage > 5"
        class="px-4 py-2 rounded hover:bg-sky-100 cursor-pointer"
        >...</a
      >
    </template>

    <template v-for="number in pageNumbersToShow" :key="number">
      <a
        @click="$emit('paginate', number)"
        :class="
          'px-4 py-2 rounded cursor-pointer ' +
          (number == currentPage
            ? 'bg-sky-200 text-gray-900 font-medium hover:bg-sky-100'
            : 'hover:bg-sky-100')
        "
      >
        {{ number }}
      </a>
    </template>
    <template v-if="pageNumbersToShow.indexOf(pageNumbers.length) < 0">
      <a
        v-if="currentPage < pageNumbers.length - 3"
        class="p-2 ml-4 rounded hover:bg-sky-100"
        >...</a
      >
      <a
        class="p-2 ml-4 rounded hover:bg-sky-100 cursor-pointer"
        @click="$emit('paginate', pageNumbers.length)"
      >
        {{ pageNumbers.length }}
      </a>
    </template>

    <a
      v-if="currentPage < pageNumbers.length"
      class="p-2 ml-4 rounded hover:bg-sky-100 cursor-pointer"
      @click="$emit('paginate', Number(currentPage) + 1)"
    >
      <NextIcon />
    </a>
  </div>
</template>
