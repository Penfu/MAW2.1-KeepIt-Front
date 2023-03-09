<script setup lang="ts">
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
defineProps<{
  fullname: string;
  description: string;
}>();
</script>

<template>
  <div class="bg-white md:shadow-xl rounded-lg p-5">
    <ProfileIcon class="w-16 h-16 rounded-full" />
    <div class="text-sm pt-2">
      <a
        href="#"
        class="font-medium leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
      >
        {{ fullname }}
      </a>
      <p>{{ description }}</p>
    </div>
  </div>
</template>
