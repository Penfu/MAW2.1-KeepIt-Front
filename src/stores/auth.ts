import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import User from '@/models/user';

export type Error = {
  $message: string;
};

type DecodedToken = {
  user: User;
};

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null as string | null);
  const refreshToken = ref(null as string | null);
  const message = ref<string>();
  const loginErrors = ref<Error[]>([]);
  const registerErrors = ref<Error[]>([]);
  const user = ref<User | null>(null);
  const isAuth = computed(() => !!user.value);
  const decodedToken = computed(() => {
    if (token.value) {
      console.log(jwt_decode(token.value));
      return jwt_decode(token.value) as DecodedToken;
    } else {
      return null;
    }
  });

  // subscribe to token changes and set user if token is present
  watch(decodedToken, (newVal) => {
    User.fromJson(newVal?.user)
      .then((currentUser) => {
        user.value = currentUser;
      })
      .catch((errors) => {
        console.log(errors);
        user.value = null;
      });
  });

  if (localStorage.getItem('token')) {
    token.value = localStorage.getItem('token');
  }

  function cleanErrors() {
    loginErrors.value = [];
    registerErrors.value = [];
  }

  function cleanMessage() {
    message.value = '';
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/login', {
        login: email,
        password: password,
      });

      token.value = response.data['access_token'];
      refreshToken.value = response.data['refresh_token'];
      localStorage.setItem('token', token.value as string);
      localStorage.setItem('refresh_token', refreshToken.value as string);
    } catch (error: any) {
      console.log(error.response.data['field-error']);
      loginErrors.value = [{ $message: error.response.data['field-error'][1] }];
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

      token.value = response.data['access_token'];
      refreshToken.value = response.data['refresh_token'];
      localStorage.setItem('token', token.value as string);
      localStorage.setItem('refresh_token', refreshToken.value as string);

      message.value = 'You have successfully registered!';

      cleanErrors();
    } catch (error: any) {
      registerErrors.value = [
        { $message: error.response.data['field-error'][1] },
      ];
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
    token,
  };
});
