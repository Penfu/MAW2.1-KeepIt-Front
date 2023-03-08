<script setup lang="ts">
import AchievementCard from '@/components/AchievementCard.vue';
</script>

<template>
  <div>
    <div class="pt-10 flex flex-row">
      <div class="flex flex-row justify-center w-2/3">
        <img
          class="w-16 h-16 rounded-full mr-3"
          src="https://loremflickr.com/320/320/girl"
          alt="jane"
        />
        <div class="text-sm pt-2">
          <a
            href="#"
            class="font-medium leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out"
          >
            Jane doe
          </a>
          <p>Blogger &amp; Youtuber</p>
        </div>
      </div>

      <div class="flex flex-col">
        <div class="grid md:grid-cols-2 gap-4 pr-5">
          <AchievementCard
            title="Master of the Elements"
            description="Unlock every elemental ability in the game and defeat the final boss using all four elements"
            :percentage="15"
            picture=""
          />
          <AchievementCard
            title="Treasure Hunter"
            description="Find all hidden treasure chests scattered throughout the game world."
            :percentage="2"
            picture=""
          />
          <AchievementCard
            title="Master of the Elements"
            description="Unlock every elemental ability in the game and defeat the final boss using all four elements"
            :percentage="15"
            picture=""
          />
          <AchievementCard
            title="Treasure Hunter"
            description="Find all hidden treasure chests scattered throughout the game world."
            :percentage="2"
            picture=""
          />
        </div>
        <p class="pt-5 text-center">
          <a href="" class="no-underline hover:underline text-sky-400">
            See more
          </a>
        </p>
      </div>
    </div>

    <div class="py-2 border-b-2"></div>
  </div>
</template>
