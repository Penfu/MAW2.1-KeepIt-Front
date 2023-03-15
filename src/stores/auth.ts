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
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const message = ref<string>();
  const loginErrors = ref<Error[]>([]);
  const registerErrors = ref<Error[]>([]);
  const user = ref<User | null>(null);
  const isAuth = computed(() => {
    return !!token.value;
  });
  const decodedToken = computed(() => {
    console.log('token.value', token.value);
    if (token.value) {
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

  // Automatically set token and refresh token if they are present in local storage
  if (localStorage.getItem('token') && localStorage.getItem('refresh_token')) {
    token.value = localStorage.getItem('token');
    refreshToken.value = localStorage.getItem('refresh_token');

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
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

      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
    } catch (error: any) {
      return Promise.reject([
        { $message: error.response.data['field-error'][1] },
      ]);
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
    user.value = null;

    localStorage.removeItem('token');

    cleanMessage();
    cleanErrors();
  }

  async function refreshJwtToken() {
    user.value = null;
    try {
      const response = await axios.post('/jwt-refresh', {
        refresh_token: refreshToken.value,
      });

      token.value = response.data['access_token'];
      refreshToken.value = response.data['refresh_token'];

      localStorage.setItem('token', token.value as string);
      localStorage.setItem('refresh_token', refreshToken.value as string);
    } catch (error: any) {
      logout();
    }
  }

  return {
    user,
    isAuth,
    login,
    register,
    logout,
    loginErrors,
    registerErrors,
    refreshJwtToken,
    message,
    Error,
    token,
  };
});
