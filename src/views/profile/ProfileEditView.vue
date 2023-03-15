<script setup lang="ts">
import User from '@/models/user';
import UserProvider from '@/providers/user';
import useVuelidate from '@vuelidate/core';
import { email, required, minLength } from '@vuelidate/validators';
import { computed, reactive, ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import { useAuthStore } from '@/stores/auth';
import type { AuthError } from '@/types/Errors';

const props = defineProps<{ id: string }>();
const user = ref<User | null>(null);
const isLoading = ref<boolean>(false);
const errors = ref<AuthError[]>([]);
const auth = useAuthStore();

const isUserAuthorized = computed(() => {
  return auth.isAuth && auth.user?.id == props.id;
});

// The open/closed state lives outside of the Dialog and
// is managed by you.
const isOpen = ref(false);

watch(
  () => props.id,
  async (newId) => {
    user.value = null;
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
  const UpdatedUser = await User.make(
    user.value?.id ?? props.id,
    email,
    username
  );

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
  <button
    v-if="isUserAuthorized"
    @click="isOpen = true"
    class="leading-none text-blue-900 hover:text-indigo-600 transition duration-500 ease-in-out"
  >
    Edit profile
  </button>
  <Dialog :open="isOpen" @close="isOpen = false" class="relative z-50">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

    <!-- Full-screen container to center the panel -->
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <!-- The actual dialog panel -->
      <DialogPanel
        class="p-4 w-full max-w-sm rounded-lg bg-white space-y-8 drop-shadow-md"
      >
        <DialogTitle
          class="text-xl font-bold flex justify-between items-center"
        >
          <h3>Edit account</h3>
          <button
            @click="isOpen = false"
            class="py-2 px-4 text-sm bg-gray-200 hover:bg-zinc-800 rounded-md hover:text-white border border-gray-700"
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

            <button
              type="submit"
              class="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-lg flex justify-center items-center gap-2"
            >
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
</template>
