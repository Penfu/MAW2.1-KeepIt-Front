<script setup lang="ts">
import router from '@/router';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import Dropdown from '@/components/Dropdown.vue';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import HamburgerIcon from '@/components/icons/HamburgerIcon.vue';

const routes = router.getRoutes().filter((route) => route.meta?.inNavbar);

const auth = useAuthStore();
</script>

<template>
  <div class="max-h-screen">
    <header class="outline outline-b-2 outline-gray-100 shadow-sm">
      <nav
        class="mx-4 md:mx-12 xl:mx-auto max-w-6xl h-navbar flex items-center"
      >
        <RouterLink to="/" class="text-xl font-semibold">Keep It</RouterLink>

        <div class="grow">
          <!-- Big Menu -->
          <div class="grow hidden md:flex items-center">
            <div
              class="grow flex justify-center items-center space-x-6 text-lg text-gray-700"
            >
              <RouterLink
                v-for="route in routes"
                :key="route.name"
                :to="route.path"
                class="p-2 font-semibold"
                active-class="bg-blue-100 text-blue-500 rounded"
              >
                {{ route.name }}
              </RouterLink>
            </div>

            <!-- User Actions -->
            <Dropdown class="relative">
              <template #trigger>
                <ProfileIcon />
              </template>
              <template #content>
                <div
                  class="absolute w-44 right-0 mt-2 p-2 bg-white rounded-lg border border-gray-200 shadow-md"
                >
                  <div v-if="auth.isAuth" class="space-y-4">
                    <h4>Logged as user X</h4>
                    <button
                      @click="auth.logout()"
                      class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Logout
                    </button>
                  </div>
                  <RouterLink v-else to="/login">Login</RouterLink>
                </div>
              </template>
            </Dropdown>
          </div>
        </div>

        <!-- Small Menu -->
        <div class="md:hidden">
          <Dropdown>
            <template #trigger>
              <HamburgerIcon />
            </template>
            <template #content>
              <div
                class="absolute top-[var(--h-navbar)] left-0 py-8 inset-x-0 bg-white border border-gray-200 shadow-md"
              >
                <div class="space-y-8">
                  <div class="mx-2 flex flex-col gap-4">
                    <RouterLink
                      v-for="route in routes"
                      :key="route.name"
                      :to="route.path"
                      class="px-4 py-3 text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded"
                      active-class="bg-blue-100 text-blue-500"
                    >
                      {{ route.name }}
                    </RouterLink>
                  </div>

                  <!-- User Actions -->
                  <div
                    class="mx-2 flex flex-col gap-8 border-t-2 border-gray-600"
                  >
                    <div v-if="auth.isAuth" class="flex flex-col space-y-4">
                      <span class="py-4">Logged as user X</span>
                      <button
                        @click="auth.logout()"
                        class="bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded"
                      >
                        Logout
                      </button>
                    </div>
                    <RouterLink v-else to="/login">Login</RouterLink>
                  </div>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </nav>
    </header>

    <RouterView class="mx-4 md:mx-12 xl:mx-auto max-w-6xl" />
  </div>
</template>
