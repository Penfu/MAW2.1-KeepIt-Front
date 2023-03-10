<script setup lang="ts">
import { reactive } from 'vue';
import router from '@/router';
import { RouterLink } from 'vue-router';
import { email, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import { useAuthStore } from '@/stores/auth';

import ErrorAlert from '@/components/ErrorAlert.vue';
import SuccessAlert from '@/components/SuccessAlert.vue';

const auth = useAuthStore();

const formData = reactive({
  email: '',
  password: '',
});

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, formData);

const onSubmit = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  }

  await auth.login(formData.email, formData.password);

  if (auth.isAuth) router.push('/');
};
</script>

<template>
  <main class="py-16 space-y-12">
    <h2 class="text-3xl font-semibold uppercase text-center">Login</h2>

    <form @submit.prevent="onSubmit" class="mx-auto max-w-lg flex flex-col space-y-6">
      <SuccessAlert v-if="auth.message" :message="auth.message" />
      <ErrorAlert :errors="auth.loginErrors" />

      <div class="space-y-2">
        <ErrorAlert :errors="v$.email.$errors" />

        <div class="space-y-2">
          <label>Email</label>
          <input type="email" v-model="formData.email"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg" />
        </div>
      </div>

      <div class="space-y-2">
        <ErrorAlert :errors="v$.password.$errors" />

        <div class="space-y-2">
          <label>Password</label>
          <input type="password" v-model="formData.password"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg" />
        </div>
      </div>

      <button type="submit" class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg">
        Login
      </button>
    </form>

    <router-link to="/register" class="block text-center text-gray-600 hover:text-gray-800">
      Not already register ?
    </router-link>
  </main>
</template>