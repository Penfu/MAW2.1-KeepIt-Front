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
            <Dropdown v-if="auth.isAuth" class="relative">
              <template #trigger>
                <ProfileIcon />
              </template>
              <template #content>
                <div
                  class="absolute z-20 w-44 right-0 mt-2 p-2 bg-white rounded-lg border border-gray-200 shadow-md"
                >
                  <div class="space-y-4">
                    <h4>Logged as user {{ auth.user?.id }}</h4>
                    <RouterLink
                      :to="{
                        name: 'profile',
                        params: { id: auth.user?.id ?? '' },
                      }"
                      class="w-full block px-4 py-2 font-semibold hover:bg-gray-100 border rounded"
                    >
                      Profile
                    </RouterLink>
                    <button
                      @click="auth.logout()"
                      class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Logout
                    </button>
                  </div>
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

                  <span class="mx-2 block border-t-2 border-gray-400"></span>

                  <!-- User Actions -->
                  <div class="mx-2 flex flex-col gap-8">
                    <div
                      class="mx-2 flex flex-col gap-8 border-t-2 border-gray-600"
                    >
                      <div v-if="auth.isAuth" class="flex flex-col space-y-4">
                        <span class="py-4">Logged as user {{ auth.user }}</span>
                        <RouterLink
                          :to="{
                            name: 'profile',
                            params: { id: auth.user?.id ?? '' },
                          }"
                          class="w-full block px-4 py-2 text-lg font-semibold bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          Profile
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
                        Login</RouterLink
                      >
                    </div>
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
