<script setup lang="ts">
import router from '@/router';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import Dropdown from '@/components/Dropdown.vue';
import HamburgerIcon from '@/components/icons/HamburgerIcon.vue';

const routes = router.getRoutes().filter((route) => route.meta?.inNavbar);

const auth = useAuthStore();
</script>

<template>
  <div class="max-h-screen">
    <header class="px-8 outline outline-b-2 outline-gray-100 shadow-sm">
      <nav class="mx-auto max-w-7xl h-navbar flex items-center">
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
                class="p-2 font-semibold capitalize hover:text-blue-500"
                active-class="bg-blue-100 text-blue-500 rounded"
              >
                {{ route.name }}
              </RouterLink>
            </div>

            <!-- User Actions -->
            <Dropdown v-if="auth.isAuth" class="relative">
              <template #trigger>
                <img
                  :src="auth.user?.avatar"
                  class="w-10 rounded-full shadow"
                />
              </template>
              <template #content>
                <div
                  class="absolute z-20 w-44 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-md"
                >
                  <div class="px-4 py-2 hover:bg-gray-100">
                    <RouterLink
                      v-if="auth.user?.id"
                      :to="{
                        name: 'profile',
                        params: { id: auth.user?.id },
                      }"
                      class="hover:bg-gray-100"
                    >
                      <span class="block text-sm">{{
                        auth.user.username
                      }}</span>
                      <span
                        class="block text-sm font-medium text-gray-900 truncate"
                        >{{ auth?.user?.email }}</span
                      >
                    </RouterLink>
                  </div>
                  <hr class="border-gray-200" />
                  <ul class="py-1" aria-labelledby="dropdown">
                    <li>
                      <button
                        href="#"
                        @click="auth.logout()"
                        class="w-full text-left text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </template>
            </Dropdown>
            <RouterLink
              v-else
              to="/login"
              class="py-2 px-4 text-white font-bold bg-blue-500 hover:bg-blue-600 rounded shadow shadow-blue-300"
              >Login
            </RouterLink>
          </div>
        </div>

        <!-- Small Menu -->
        <div class="md:hidden z-20">
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
                  <div class="mx-2 flex flex-col gap-8">
                    <div
                      class="mx-2 flex flex-col gap-8 border-t-2 border-gray-600"
                    >
                      <div
                        v-if="auth.isAuth"
                        class="flex flex-col space-y-4 pt-4"
                      >
                        <RouterLink
                          v-if="auth.user?.id"
                          :to="{
                            name: 'profile',
                            params: { id: auth.user?.id },
                          }"
                          class="w-full block px-4 py-2 text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          {{ auth.user?.username }}
                        </RouterLink>
                        <button
                          @click="auth.logout()"
                          class="bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded"
                        >
                          Logout
                        </button>
                      </div>

                      <RouterLink
                        v-else
                        to="/login"
                        class="py-3 px-4 text-white text-center text-lg font-bold uppercase bg-blue-500 hover:bg-blue-600 rounded shadow shadow-blue-300"
                      >
                        Login
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </nav>
    </header>

    <main class="mx-8">
      <RouterView class="mx-auto max-w-7xl" />
    </main>
  </div>
</template>
