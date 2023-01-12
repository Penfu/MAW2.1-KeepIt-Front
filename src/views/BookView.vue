<script setup lang="ts">
import BookProvider from '@/providers/book';
import type Book from '@/models/book';
import { onMounted, ref } from 'vue';

const props = defineProps<{ id: string }>();
const book = ref({} as Book);

onMounted(async () => {
  book.value = await BookProvider.fetchBook(props.id);
});
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold">
      {{ book.title }}
    </h2>
  </div>
</template>
