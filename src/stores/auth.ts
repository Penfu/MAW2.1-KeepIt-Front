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
  const refreshToken = ref(null as string | null);
  const isAuth = computed(() => token.value != null);

  const message = ref<string>();
  const loginErrors = ref<Error[]>([]);
  const registerErrors = ref<Error[]>([]);

  // Auto-login if token is present in localStorage
  if (localStorage.getItem("token")) {
    token.value = localStorage.getItem("token");
  }

  function cleanErrors() {
    loginErrors.value = [];
    registerErrors.value = [];
  }

  function cleanMessage() {
    message.value = "";
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/login', {
        login: email,
        password: password,
      });

      token.value = response.data["access_token"];
      refreshToken.value = response.data["refresh_token"];
      localStorage.setItem('token', token.value as string);
      localStorage.setItem('refresh_token', refreshToken.value as string);
    } catch (error) {
      console.log(error.response.data["field-error"]);
      loginErrors.value = [{ $message: error.response.data["field-error"][1] }];
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

      token.value = response.data["access_token"];
      refreshToken.value = response.data["refresh_token"];
      localStorage.setItem('token', token.value as string);
      localStorage.setItem('refresh_token', refreshToken.value as string);

      message.value = "You have successfully registered!";

      cleanErrors();
    } catch (error) {
      registerErrors.value = [{ $message: error.response.data["field-error"][1] }];
      return;
    }
  }

  async function logout() {
    token.value = null;
    localStorage.removeItem('token');

    cleanMessage();
    cleanErrors();
  }

  return {
    user,
    isAuth,
    login,
    register,
    logout,
    loginErrors,
    registerErrors,
    message,
    Error,
  };
});
