<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import router from '@/router';
import { RouterLink } from 'vue-router';
import { email, minLength, required, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useAuthStore } from '@/stores/auth';
import ErrorAlert from '@/components/ErrorAlert.vue';
import type { AuthError } from '@/types/Errors';
import { useMutation } from '@tanstack/vue-query';

const authErrors = ref<AuthError[]>([]);

const formData = reactive({
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
});

const rules = computed(() => ({
  email: { required, email },
  username: { required, minLength: minLength(2) },
  password: { required, minLength: minLength(6) },
  passwordConfirmation: { required, sameAsPassword: sameAs(formData.password) },
}));

const v$ = useVuelidate(rules, formData);
const auth = useAuthStore();
const { isLoading, mutate: registerUser } = useMutation({
  mutationFn: () =>
    auth.register(
      formData.username,
      formData.email,
      formData.password,
      formData.passwordConfirmation
    ),
  onSuccess: () => {
    router.push({ name: 'home' });
  },
  onError: (error: any) => {
    authErrors.value = [{ $message: error.response.data['field-error'][1] }];
  },
});

const onSubmit = async () => {
  // validate the form
  const result = await v$.value.$validate();
  if (!result) return;

  // register the user via mutation
  registerUser();
};
</script>

<template>
  <div class="py-16 space-y-12">
    <h2 class="text-3xl font-semibold uppercase text-center">Register</h2>

    <form
      @submit.prevent="onSubmit"
      class="mx-auto max-w-lg flex flex-col space-y-6"
    >
      <div class="space-y-8">
        <ErrorAlert :errors="authErrors" />

        <div class="space-y-2">
          <ErrorAlert :errors="v$.email.$errors" />
          <div class="space-y-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              autocomplete="email"
              v-model="formData.email"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
            />
          </div>
        </div>

        <div class="space-y-2">
          <ErrorAlert :errors="v$.username.$errors" />
          <div class="space-y-2">
            <label>Username</label>
            <input
              type="text"
              name="username"
              autocomplete="username"
              v-model="formData.username"
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
              name="password"
              autocomplete="new-password"
              v-model="formData.password"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
            />
          </div>
        </div>
        <div class="space-y-2">
          <ErrorAlert :errors="v$.passwordConfirmation.$errors" />

          <div class="space-y-2">
            <label>Password Confirmation</label>
            <input
              type="password"
              name="password_confirmation"
              autocomplete="new-password"
              v-model="formData.passwordConfirmation"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
            />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <button
        class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg flex items-center justify-center"
      >
        Register

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
      to="/login"
      class="block text-center text-gray-600 hover:text-gray-800"
    >
      Already registered ?
    </router-link>
  </div>
</template>
