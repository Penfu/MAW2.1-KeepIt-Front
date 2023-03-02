<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import router from '@/router';

const open = ref(false);

onMounted(() => {
  window.addEventListener('click', onClick);
});

onUnmounted(() => {
  window.removeEventListener('click', onClick);
});

const toggle = () => {
  open.value = !open.value;
};

const onClick = (e: any) => {
  if (!e.target.closest('.dropdown')) {
    open.value = false;
  }
};

router.afterEach(() => {
  open.value = false;
});
</script>

<template>
  <div class="dropdown">
    <!-- Dropdown toggle button -->
    <button @click="toggle" class="w-full">
      <slot name="trigger"></slot>
    </button>

    <!-- Dropdown menu -->
    <div v-show="open">
      <slot name="content"></slot>
    </div>
  </div>
</template>
