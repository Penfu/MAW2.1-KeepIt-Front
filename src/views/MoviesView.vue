<script setup lang="ts">
import { onMounted, ref } from 'vue';

import debounce from 'debounce';

import MovieProvider from '@/providers/movie';
import type Movie from '@/models/movie';

import MediaList from '@/components/MediaList.vue';
import MovieCard from '@/components/media/MovieCard.vue';

const movies = ref([] as Movie[]);
const search = ref('');
const page = ref(0 as number);
const hasMore = ref(true as boolean);

const debouncedSearch = debounce(async function () {
  console.log('Searching for movies: ' + search.value);

  page.value = 1;
  hasMore.value = true;
  movies.value = await MovieProvider.fetchMovies(search.value, page.value);
}, 500);

const infiniteScroll = async () => {
  if (!hasMore.value) {
    return;
  }

  console.log('Fetching more movies... Offset: ' + page.value);
  page.value += 1;
  const newmovies = await MovieProvider.fetchMovies(search.value, page.value);
  movies.value.push(...newmovies);

  hasMore.value = newmovies.length > 0;
};

onMounted(async () => {
  page.value += 1;
  movies.value = await MovieProvider.fetchMovies(search.value, page.value);
});
</script>

<template>
  <div
    style="max-height: calc(100vh - 56px)"
    class="container h-screen flex flex-col gap-4"
  >
    <div class="flex justify-between">
      <h1>Movies</h1>

      <!-- Search bar -->
      <div class="m-2 flex items-center bg-gray-100 rounded shadow drop-shadow">
        <input
          v-model="search"
          v-on:input="debouncedSearch"
          type="text"
          class="grow py-3 px-4 rounded-lg outline-none text-lg"
          placeholder="Search for a Movie..."
        />
      </div>
    </div>

    <!-- Movies cards -->
    <MediaList
      :scroll-event="infiniteScroll"
      :medias="(movies as Movie[])"
      :mediaCard="MovieCard"
    />
  </div>
</template>
