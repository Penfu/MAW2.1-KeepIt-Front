import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import router from '@/router';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth';

import '@/assets/main.css';

const app = createApp(App);

axios.defaults.baseURL = import.meta.env.VITE_API;
axios.defaults.headers.common['Accept'] = 'application/json';

app.use(createPinia());
app.use(router);
/*
const authStore = useAuthStore();
const token = authStore.token;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
*/
app.mount('#app');
