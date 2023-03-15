<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import MovieProvider from '@/providers/movie';
import type Movie from '@/models/movie';

const props = defineProps<{ id: string }>();

const movie = ref({} as Movie);
const isLoading = ref(true);

const voteRatio = computed(() =>
  Math.round(
    //(movie.value.upvotes / (movie.value.upvotes + movie.value.downvotes)) * 100
  )
);

onMounted(async () => {
  movie.value = await MovieProvider.fetchMovie(props.id);
  isLoading.value = false;
});

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
              <p class="text-sm text-gray-500">{{ movie.title !== movie.originalTitle && movie.originalTitle ? `${movie.originalTitle}` : ''  }}</p>
              <p class="text-sm text-gray-500">{{ movie.tagline }}</p>
            </div>
            <p class="text-sm text-gray-500">
              <span v-for="(company, index) in movie.productionCompanies" :key="index">
                {{ company.name }}{{ index < movie.productionCompanies.length - 1 ? ', ' : '' }}
              </span>
            </p>
            <p class="text-sm text-gray-500">{{ movie.releaseDate }}</p>
            <p class="flex flex-col md:flex-row gap-2 text-sm text-white">
              <span v-for="(genre, index) in movie.genres" :key="index"
                class="px-2 py-1 w-fit bg-gray-700 rounded-lg">
                {{ genre.name }}
              </span>
            </p>
          </div>

          <!-- TODO Vote -->
          <div class="grow flex justify-center md:justify-end items-center">
            <div class="flex flex-row md:flex-col gap-4 items-center">
              <button @click="handleUpVote()" class="w-12 h-12 rounded-lg text-white text-2xl shadow-md shadow-gray-300"
                :class="[movie.userVote === 1 ? 'bg-gray-700' : 'bg-gray-200 hover:bg-gray-300']">
                👍
              </button>
              <span class="w-12 h-12 border-2 border-gray-700 rounded-lg align-middle flex justify-center items-center">
                {{ isNaN(voteRatio) ?'~': `${voteRatio} %` }}
              </span>
              <button @click="handleDownVote()"
                class="w-12 h-12 rounded-lg text-white text-2xl shadow-md shadow-gray-300"
                :class="[movie.userVote === -1 ? 'bg-gray-700' : 'bg-gray-200 hover:bg-gray-300']">
                👎
              </button>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-6">
          <p class="text-base text-gray-900" v-html="movie.overview"></p>
        </div>
      </div>
    </div>
  </div>
</template>
