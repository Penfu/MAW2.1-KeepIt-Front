import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import User, { InvalidUserException } from '@/models/user';

type DecodedToken = {
  user: User;
};

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const user = ref<User | null>(null);
  const isAuth = computed(() => {
    return !!token.value;
  });
  const decodedToken = computed(() => {
    if (token.value) {
      return jwt_decode(token.value) as DecodedToken;
    }

    return null;
  });

  // subscribe to token changes and set user if token is present
  watch(decodedToken, async (newToken) => {
    await User.fromJson(newToken?.user)
      .then((currentUser) => {
        user.value = currentUser;
      })
      .catch((error: any) => {
        // Only log the error if it is an InvalidUserException
        if (error instanceof InvalidUserException) {
          console.log(error.message);
        }
        user.value = null;
        logout();
      });
  });

  // Automatically set token and refresh token if they are present in local storage
  if (localStorage.getItem('token') && localStorage.getItem('refresh_token')) {
    token.value = localStorage.getItem('token');
    refreshToken.value = localStorage.getItem('refresh_token');

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await axios.post('/login', {
      login: email,
      password: password,
    });

    token.value = response.data['access_token'];
    refreshToken.value = response.data['refresh_token'];

    localStorage.setItem('token', token.value as string);
    localStorage.setItem('refresh_token', refreshToken.value as string);

    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.value;
  }

  async function register(
    email: string,
    password: string,
    password_confirm: string
  ): Promise<void> {
    const response = await axios.post('/register', {
      login: email,
      password: password,
      'password-confirm': password_confirm,
    });

    token.value = response.data['access_token'];
    refreshToken.value = response.data['refresh_token'];

    localStorage.setItem('token', token.value as string);
    localStorage.setItem('refresh_token', refreshToken.value as string);
  }

  async function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
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
      console.log(error.message);
      logout();
    }
  }

  return {
    user,
    isAuth,
    login,
    register,
    logout,
    refreshJwtToken,
    token,
  };
});
