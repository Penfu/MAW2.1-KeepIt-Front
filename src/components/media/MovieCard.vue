<script setup lang="ts">
import { defineProps } from 'vue';
import type Movie from '@/models/movie';

const props = defineProps<{
  media: Movie;
}>();
</script>

<template>
  <RouterLink :to="'/books/'"
    class="flex flex-col h-80 w-56 bg-gray-100 rounded-xl shadow drop-shadow-lg hover:cursor-pointer hover:scale-105 transition ease-in-out">
    <!-- Cover -->
    <div class="grow h-48 rounded-t-xl">
      <!--
        <img :src="'/assets/placeholder.png'" class="h-full w-full object-cover rounded-t-xl"
        alt="Book cover" />
      -->
    </div>

    <!-- Vote -->
    <div class="z-30 -mt-5 -mb-5 flex">
      <div
        class="group mx-2 p-2 w-14 h-10 hover:w-full flex bg-gray-800 text-white rounded cursor-default transition-width transition-slowest duration-300 ease-in-out">
        <div class="mx-auto overflow-hidden">
          <span class="group-hover:hidden">{{ 0 }}%</span>
          <span class="hidden group-hover:block">
            {{ 0 }}👍 {{ 0 }}👎
          </span>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="z-20 px-4 pt-8 pb-4 h-32 bg-white rounded flex flex-col space-y-2">
      <h2 class="relative group grow text-ellipsis overflow-hidden font-bold">
        Titre du film
      </h2>
      <p class="text-sm text-gray-500">
        Date de sortie
      </p>
    </div>
  </RouterLink>
</template>
