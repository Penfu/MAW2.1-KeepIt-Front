<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { email, required, minLength } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import UserProvider from '@/providers/user';

import { useAuthStore } from '@/stores/auth';
import type { Error } from '@/stores/auth';

import User from '@/models/user';

import ErrorAlert from '@/components/ErrorAlert.vue';

const auth = useAuthStore();

const props = defineProps<{
  id: string;
}>();

const user = ref<User | null>(null);
const isLoading = ref<boolean>(false);
const errors = ref<Error[]>([]);

const isUserAuthorized = computed(() => {
  return auth.isAuth && auth.user?.id == props.id;
});

// The open/closed state lives outside of the Dialog and
// is managed by you.
const isOpen = ref(false);

watch(
  () => props.id,
  async (newId) => {
    user.value = await UserProvider.fetchUser(newId);
    formData.email = user.value?.email;
    formData.username = user.value?.username || '';
  },
  { immediate: true }
);

const formData = reactive({
  email: '',
  username: '',
});

const rules = {
  email: { required, email },
  username: { minLength: minLength(3) },
};

const v$ = useVuelidate(rules, formData);

const onSubmit = async () => {
  isLoading.value = true;
  errors.value = [];

  const result = await v$.value.$validate();
  if (!result) {
    return;
  }

  const { email, username } = formData;
  const UpdatedUser = new User(user.value?.id ?? props.id, email, username);

  try {
    await UserProvider.updateUser(UpdatedUser);
    await auth.refreshJwtToken();
    isOpen.value = false;
  } catch (error: any) {
    errors.value = Object.keys(error.response.data).map((key) => {
      return { $message: key + ' ' + error.response.data[key] };
    });
  }
  isLoading.value = false;
};
</script>

<template>
  <div>
    <div class="flex justify-end">
      <button
        v-if="isUserAuthorized"
        @click="isOpen = true"
        class="btn w-full md:w-auto"
      >
        Edit profile
      </button>
    </div>

    <Dialog :open="isOpen" @close="isOpen = false" class="relative z-50">
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

      <!-- Full-screen container to center the panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <!-- The actual dialog panel -->
        <DialogPanel
          class="p-4 w-full max-w-sm rounded-lg bg-white space-y-8 drop-shadow-md"
        >
          <DialogTitle class="flex justify-between items-center">
            <h3 class="text-xl font-bold">Edit account</h3>
            <button
              @click="isOpen = false"
              class="py-2 px-4 font-bold bg-gray-200 hover:bg-zinc-800 rounded-md hover:text-white border border-gray-700"
            >
              Close
            </button>
          </DialogTitle>

          <div class="flex items-center gap-2">
            <form
              @submit.prevent="onSubmit"
              class="mx-auto max-w-md flex flex-col space-y-6"
            >
              <ErrorAlert :errors="[]" />

              <div class="space-y-2">
                <ErrorAlert :errors="errors" />

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
                <ErrorAlert :errors="v$.username.$errors" />

                <div class="space-y-2">
                  <label>Username</label>
                  <input
                    type="text"
                    v-model="formData.username"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg"
                  />
                </div>
              </div>

              <button type="submit" class="btn">
                Save
                <div
                  v-if="isLoading"
                  class="animate-spin rounded-full h-4 w-4 border-b-2 border-white-800"
                ></div>
              </button>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </div>
</template>
