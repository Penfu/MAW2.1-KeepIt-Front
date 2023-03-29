<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import debounce from 'debounce';
import MovieProvider from '@/providers/movie';
import type Movie from '@/models/movie';

const props = defineProps<{ id: string }>();

const movie = ref({} as Movie);
const isLoading = ref(true);

const voteRatio = computed(() =>
  Math.round(
    (movie.value.upvotes / (movie.value.upvotes + movie.value.downvotes)) * 100
  )
);

onMounted(async () => {
  movie.value = await MovieProvider.fetchMovie(props.id);
  isLoading.value = false;
});

const handleUpVote = () => {
  if (movie.value.userVote === 1) {
    handleUnVote();
    movie.value.upvotes--;
    return;
  }

  MovieProvider.upVote(props.id);
  movie.value.upvotes++;

  if (movie.value.userVote === -1) {
    movie.value.downvotes--;
  }

  movie.value.userVote = 1;
};

const handleDownVote = () => {
  if (movie.value.userVote === -1) {
    handleUnVote();
    movie.value.downvotes--;
    return;
  }

  MovieProvider.downVote(props.id);
  movie.value.downvotes++;

  if (movie.value.userVote === 1) {
    movie.value.upvotes--;
  }

  movie.value.userVote = -1;
};

const handleUnVote = () => {
  MovieProvider.unVote(props.id);
  movie.value.userVote = 0;
};

const watchingProgress = computed(() => {
  console.log(movie.value.userTime, movie.value.runtime);
  return Math.round((movie.value.userTime / movie.value.runtime) * 100);
});

const isTimeTrackOpen = ref(false);

const onTimeTrackInput = () => {
  if (movie.value.userTime < 0 || !movie.value.userTime) movie.value.userTime = 0;
  else if (movie.value.userTime > movie.value.runtime)
    movie.value.userTime = movie.value.runtime;

  debouncedUserTimeTracking();
};

const debouncedUserTimeTracking = debounce(async function () {
  MovieProvider.track(props.id, movie.value.userTime);
}, 1000);
</script>

<template>
  <div class="my-12">
    <div v-if="isLoading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-800">
      </div>
    </div>
    <div v-else>
      <!-- Movie details  -->
      <div class="flex flex-col gap-12">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- poster -->
          <div class="w-64 md:w-32">
            <img :src="movie.poster" alt="Movie poster" class="rounded" />
          </div>

          <!-- Title, productionCompanies, releaseDate ,genre -->
          <div class="flex flex-col justify-between space-y-2">
            <div class="">
              <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{{ movie.title }}</h1>
              <p class="text-sm text-gray-500">{{ movie.title !== movie.originalTitle && movie.originalTitle ?
                `${movie.originalTitle}` : '' }}</p>
              <p class="text-sm text-gray-500">{{ movie.tagline }}</p>
            </div>
            <p class="text-sm text-gray-500">
              <span v-for="(company, index) in movie.productionCompanies" :key="index">
                {{ company.name }}{{ index < movie.productionCompanies.length - 1 ? ', ' : '' }} </span>
            </p>
            <p class="text-sm text-gray-500">{{ movie.releaseDate }}</p>
            <p class="flex flex-col md:flex-row gap-2 text-sm text-white">
              <span v-for="(genre, index) in movie.genres" :key="index" class="px-2 py-1 w-fit bg-gray-700 rounded-lg">
                {{ genre.name }}
              </span>
            </p>
          </div>

          <!--  Vote -->
          <div class="grow flex justify-center md:justify-end items-center">
            <div class="flex flex-row md:flex-col gap-4 items-center">
              <button @click="handleUpVote()" class="w-12 h-12 rounded-lg text-white text-2xl shadow-md shadow-gray-300"
                :class="[movie.userVote === 1 ? 'bg-gray-700' : 'bg-gray-200 hover:bg-gray-300']">
                👍
              </button>
              <span class="w-12 h-12 border-2 border-gray-700 rounded-lg align-middle flex justify-center items-center">
                {{ isNaN(voteRatio) ? '~' : `${voteRatio} %` }}
              </span>
              <button @click="handleDownVote()" class="w-12 h-12 rounded-lg text-white text-2xl shadow-md shadow-gray-300"
                :class="[movie.userVote === -1 ? 'bg-gray-700' : 'bg-gray-200 hover:bg-gray-300']">
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
              <span> You’re </span>
              <span class="text-blue-500 font-bold">
                {{ watchingProgress }}%
              </span>
              <span> through the film. </span>
            </h3>

            <button @click="isTimeTrackOpen = true" class="p-2 bg-gray-700 text-white rounded-md">
              Change my progression
            </button>
          </div>
          <!-- Progress bar -->
          <div class="h-6 rounded bg-gray-200">
            <div :style="`width: ${watchingProgress}%;`"
              class="h-full flex justify-end bg-gray-700 rounded text-white transition-width duration-150"></div>
          </div>

          <!-- Current time -->
          <label>
            {{ movie.userTime }}
            /
            {{ movie.runtime }}
          </label>
        </div>

        <!-- Description -->
        <div class="space-y-6">
          <p class="text-base text-gray-900" v-html="movie.overview"></p>
        </div>
      </div>

      <!-- Update current user time modal -->
      <Dialog :open="isTimeTrackOpen" @close="isTimeTrackOpen = false" class="relative z-50">
        <!-- The backdrop, rendered as a fixed sibling to the panel container -->
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

        <!-- Full-screen container to center the panel -->
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <!-- The actual dialog panel -->
          <DialogPanel class="p-4 w-full max-w-sm rounded-lg bg-white space-y-8 drop-shadow-md">
            <DialogTitle class="text-xl font-bold">Set your current time</DialogTitle>

            <div class="flex items-center gap-2">
              <input type="number" v-model="movie.userTime" @input="onTimeTrackInput" :min="0" :max="movie.runtime"
                class="p-2 w-full border-2 border-gray-200 rounded-md text-center" />
              <label class="text-2xl">/</label>
              <label class="p-2 w-full bg-gray-100 border-2 rounded-md text-center">
                {{ movie.runtime }}
              </label>
            </div>

            <div class="flex justify-end gap-2">
              <button @click="isTimeTrackOpen = false"
                class="py-2 px-4 bg-gray-700 hover:bg-gray-800 rounded-md text-white">
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  </div>
</template>
