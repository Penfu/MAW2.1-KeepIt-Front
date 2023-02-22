<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import debounce from 'debounce';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';

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

const readingProgress = computed(() => {
  return Math.round((book.value.userPage / book.value.numberOfPages) * 100);
});

const isPageTrackOpen = ref(false)

const onPageTrackInput = () => {
  if (book.value.userPage < 0 || !book.value.userPage)
    book.value.userPage = 0;
  else if (book.value.userPage > book.value.numberOfPages)
    book.value.userPage = book.value.numberOfPages;

  debouncedUserPageTracking();
}

const debouncedUserPageTracking = debounce(async function () {
  BookProvider.track(props.id, book.value.userPage);
}, 1000);

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
              <p class="text-sm text-gray-500">{{ book.numberOfPages }} pages</p>
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

        <!-- Progression -->
        <div class="flex flex-col gap-2">
          <!-- Progress Description -->
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">
              <span>
                You’re
              </span>
              <span class="text-blue-500 font-bold">
                {{ readingProgress }}%
              </span>
              <span>
                through the book.
              </span>
            </h3>

            <button @click="isPageTrackOpen = true" class="p-2 bg-gray-700 text-white rounded-md">
              Change my progression
            </button>

          </div>
          <!-- Progress bar -->
          <div class="h-6 rounded bg-gray-200">
            <div :style="`width: ${readingProgress}%;`"
              class="h-full flex justify-end bg-gray-700 rounded text-white transition-width duration-150">
            </div>
          </div>

          <!-- Current page -->
          <label>
            {{ book.userPage }}
            /
            {{ book.numberOfPages }}
          </label>
        </div>

        <!-- Description -->
        <div class="space-y-6">
          <p class="text-base text-gray-900" v-html="book.description"></p>
        </div>
      </div>
    </div>
  </div>

  <!-- Update current user page modal -->
  <Dialog :open="isPageTrackOpen" @close="isPageTrackOpen = false" class="relative z-50">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

    <!-- Full-screen container to center the panel -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <!-- The actual dialog panel -->
      <DialogPanel class="p-4 w-full max-w-sm rounded-lg bg-white space-y-8 drop-shadow-md">
        <DialogTitle class="text-xl font-bold">Set your current page</DialogTitle>

        <div class="flex items-center gap-2">
          <input type="number" v-model="book.userPage" @input="onPageTrackInput" :min="0" :max="book.numberOfPages"
            class="p-2 w-full border-2 border-gray-200 rounded-md text-center" />
          <label class="text-2xl">/</label>
          <label class="p-2 w-full bg-gray-100 border-2 rounded-md text-center">
            {{ book.numberOfPages }}
          </label>
        </div>

        <div class="flex justify-end gap-2">
          <button @click="isPageTrackOpen = false"
            class="py-2 px-4 bg-gray-700 hover:bg-gray-800 rounded-md text-white">
            Close
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
