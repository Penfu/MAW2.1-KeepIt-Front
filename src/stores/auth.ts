import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export type Error = {
  $message: string;
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: null as number | null,
  });
  const token = ref(null as string | null);
  const isAuth = computed(() => token.value != null);

  const loginErrors = ref<Error[]>([]);
  const registerErrors = ref<Error[]>([]);

  async function login(email: string, password: string): Promise<void> {
    console.log('login');

    const response = await axios.post('/login', {
      login: email,
      password: password,
    });

    if (response.status !== 200) {
      loginErrors.value = response.data;
      return;
    }

    token.value = response.headers['authorization'];
    localStorage.setItem('token', response.data.token);
  }

  async function register(email: string, password: string): Promise<void> {
    console.log('register not implemented yet');
  }

  async function logout() {
    console.log('logout');

    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    isAuth,
    login,
    register,
    logout,
    loginErrors,
    registerErrors,
    Error,
  };
});
