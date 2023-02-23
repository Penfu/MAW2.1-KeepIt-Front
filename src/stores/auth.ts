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
    try {
      const response = await axios.post('/login', {
        login: email,
        password: password,
      });

      token.value = response.headers['authorization'];
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      loginErrors.value = [{ $message: error.response.data }];
      return;
    }
  }

  async function register(
    email: string,
    password: string,
    password_confirm: string
  ): Promise<void> {
    try {
      const response = await axios.post('/register', {
        login: email,
        password: password,
        'password-confirm': password_confirm,
      });

      token.value = response.headers['authorization'];
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      registerErrors.value = [{ $message: error.response.data }];
      return;
    }
  }

  async function logout() {
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
