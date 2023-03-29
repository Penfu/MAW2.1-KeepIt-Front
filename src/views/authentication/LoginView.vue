<script setup lang="ts">
import { reactive, ref } from 'vue';
import router from '@/router';
import { RouterLink } from 'vue-router';
import { email, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import { useAuthStore } from '@/stores/auth';

import ErrorAlert from '@/components/ErrorAlert.vue';
import type { AuthError } from '@/types/Errors';
import { useMutation } from '@tanstack/vue-query';

const auth = useAuthStore();
const authErrors = ref<AuthError[]>([]);

const formData = reactive({
  email: '',
  password: '',
});

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, formData);

const { isLoading, mutate: loginUser } = useMutation({
  mutationFn: () => auth.login(formData.email, formData.password),
  onSuccess: () => {
    router.push({ name: 'home' });
  },
  onError: (error: any) => {
    authErrors.value = [{ $message: error.response.data['field-error'][1] }];
  },
});

const onSubmit = async () => {
  const result = await v$.value.$validate();
  authErrors.value = [];
  if (!result) return;

  loginUser();
};
</script>

<template>
  <main class="py-16 space-y-12">
    <h2 class="text-3xl font-semibold uppercase text-center">Login</h2>

    <form
      @submit.prevent="onSubmit"
      class="mx-auto max-w-lg flex flex-col space-y-6"
    >
      <ErrorAlert :errors="authErrors" />

      <div class="space-y-2">
        <ErrorAlert :errors="v$.email.$errors" />

        <div class="space-y-2">
          <label>Email</label>
          <input
            type="email"
            v-model="formData.email"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
          />
        </div>
      </div>

      <div class="space-y-2">
        <ErrorAlert :errors="v$.password.$errors" />

        <div class="space-y-2">
          <label>Password</label>
          <input
            type="password"
            v-model="formData.password"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg flex justify-center items-center"
      >
        Login

        <!-- Spinner -->
        <svg
          v-if="isLoading"
          class="animate-spin h-5 w-5 ml-3 -mr-1 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </button>
    </form>

    <router-link
      to="/register"
      class="block text-center text-gray-600 hover:text-gray-800"
    >
      Not already register ?
    </router-link>
  </main>
</template>
