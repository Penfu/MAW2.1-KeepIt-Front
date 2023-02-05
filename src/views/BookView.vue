<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import BookProvider from '@/providers/book';
import type Book from '@/models/book';

const props = defineProps<{ id: string }>();

const book = ref({} as Book);
const isLoading = ref(true);

const voteRatio = computed(() =>
  Math.round(
    (book.value.upvotes / (book.value.upvotes + book.value.downvotes)) * 100
  )
);

onMounted(async () => {
  book.value = await BookProvider.fetchBook(props.id);
  isLoading.value = false;
});

const handleUpVote = () => {
  if (book.value.userVote === 1) {
    handleUnVote();
    book.value.upvotes--;
    return;
  }

  BookProvider.upVote(props.id);
  book.value.upvotes++;

  if (book.value.userVote === -1) {
    book.value.downvotes--;
  }

  book.value.userVote = 1;
}

const handleDownVote = () => {
  if (book.value.userVote === -1) {
    handleUnVote();
    book.value.downvotes--;
    return;
  }

  BookProvider.downVote(props.id);
  book.value.downvotes++;

  if (book.value.userVote === 1) {
    book.value.upvotes--;
  }

  book.value.userVote = -1;
}

const handleUnVote = () => {
  BookProvider.unVote(props.id);
  book.value.userVote = 0;
}

</script>

<template>
  <div class="my-12">
    <div v-if="isLoading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-800">
      </div>
    </div>
    <div v-else>
      <!-- Book details  -->
      <div class="flex flex-col gap-12">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- cover -->
          <div class="w-64 md:w-32">
            <img :src="book.cover" alt="Book cover" class="rounded" />
          </div>

          <!-- Title, authors, publishedAt, subjects -->
          <div class="flex flex-col justify-between space-y-2">
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ book.title }}</h1>

            <div class="space-y-2">
              <p class="text-sm text-gray-500">
                <span v-for="(author, index) in book.authors" :key="index">
                  {{ author }}
                  <template v-if="index < book.authors.length - 1">,</template>
                </span>
              </p>
              <p class="text-sm text-gray-500">{{ book.publishedAt }}</p>
              <p class="flex flex-col md:flex-row gap-2 text-sm text-white">
                <span v-for="(subject, index) in book.subjects" :key="index"
                  class="px-2 py-1 w-fit bg-gray-700 rounded-lg">
                  {{ subject }}
                </span>
              </p>
            </div>
          </div>

          <!-- Vote -->
          <div class="grow flex justify-center md:justify-end items-center">
            <div class="flex flex-row md:flex-col gap-4 items-center">
              <button @click="handleUpVote()" class="w-12 h-12 rounded-lg text-white text-2xl shadow-md shadow-gray-300"
                :class="[book.userVote === 1 ? 'bg-gray-700' : 'bg-gray-200 hover:bg-gray-300']">
                👍
              </button>
              <span class="w-12 h-12 border-2 border-gray-700 rounded-lg align-middle flex justify-center items-center">
                {{ isNaN(voteRatio) ?'~': `${voteRatio} %` }}
              </span>
              <button @click="handleDownVote()"
                class="w-12 h-12 rounded-lg text-white text-2xl shadow-md shadow-gray-300"
                :class="[book.userVote === -1 ? 'bg-gray-700' : 'bg-gray-200 hover:bg-gray-300']">
                👎
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-6">
          <p class="text-base text-gray-900" v-html="book.description"></p>
        </div>
      </div>
    </div>
  </div>
</template>
