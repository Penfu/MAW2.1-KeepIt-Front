<script setup lang="ts">
import BookProvider from '@/providers/book';
import type Book from '@/models/book';
import { computed, onMounted, ref } from 'vue';

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

</script>

<template>
  <div>
    <div v-if="isLoading" class="flex-grow flex justify-center items-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-800">
      </div>
    </div>
    <div v-else class="sm:inline-flex m-2 space-x-4">
      <!-- cover -->
      <div class="flex-1 basis-32 place-content-center grow-0">
        <img :src="book.cover" alt="Book cover" />
      </div>

      <!-- Book details  -->
      <div class="flex-1 basis-1/2 place-content-start">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ book.title }}</h1>
        <p class="text-sm text-gray-500">
          <span v-for="(author, index) in book.authors" :key="index">
            {{ author }}
            <template v-if="index < book.authors.length - 1">,</template>
          </span>
        </p>
        <p class="text-sm text-gray-500">{{ book.publishedAt }}</p>
        <p class="text-sm text-gray-500">
          <span v-for="(subject, index) in book.subjects" :key="index">
            {{ subject }}
            <template v-if="index < book.subjects.length - 1">,</template>
          </span>
        </p>
        <div class="mt-10">
          <!-- Description -->
          <div>
            <div class="space-y-6">
              <p class="text-base text-gray-900" v-html="book.description"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vote -->
      <div class="flex-1 place-content-center grow-0">
        <div class="group mx-2 p-2 w-15 h-10">
          <div>
            <span class="bg-gray-800 text-white rounded cursor-default">
              👍
            </span>
            <span>
              {{ voteRatio }}%
            </span>
            <span class="bg-gray-800 text-white rounded cursor-default">
              👎
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
