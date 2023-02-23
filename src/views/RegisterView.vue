<script setup lang="ts">
import { computed, reactive } from 'vue';
import router from '@/router';
import { RouterLink } from 'vue-router';
import { email, minLength, required, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import { useAuthStore } from '@/stores/auth';

import ErrorAlert from '@/components/ErrorAlert.vue';

const onSubmit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    console.log(v$);
    return;
  }

  await auth.register(
    formData.email,
    formData.password,
    formData.passwordConfirmation
  );

  if (auth.isAuth) router.push('/');
};

const formData = reactive({
  email: '',
  password: '',
  passwordConfirmation: '',
});

const rules = computed(() => ({
  email: { required, email },
  password: { required, minLength: minLength(6) },
  passwordConfirmation: { required, sameAsPassword: sameAs(formData.password) },
}));

const v$ = useVuelidate(rules, formData);
const auth = useAuthStore();
</script>

<template>
  <main class="mx-4 md:mx-8 lg:mx-16 xl:mx-32">
    <div
      class="py-16 w-full flex items-center justify-center flex-col space-y-4"
    >
      <div class="max-w-lg w-full space-y-12">
        <h2 class="text-3xl font-semibold uppercase text-center">Register</h2>
      </div>

      <!-- Multi-Step form -->
      <form
        @submit.prevent="onSubmit"
        class="max-w-lg w-full flex flex-col space-y-6"
      >
        <div class="space-y-8">
          <ErrorAlert :errors="auth.registerErrors" />

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
                name="password"
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
                v-model="formData.passwordConfirmation"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
              />
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <button
          class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg"
        >
          Register
        </button>
      </form>

      <router-link to="/login" class="text-gray-600 hover:text-gray-800">
        Already registered ?
      </router-link>
    </div>
  </main>
</template>
