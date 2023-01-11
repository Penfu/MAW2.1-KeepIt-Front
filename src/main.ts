import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import axios from 'axios';

import './assets/main.css';

const app = createApp(App);

axios.defaults.baseURL = import.meta.env.VITE_API;
axios.defaults.headers.common['Accept'] = 'application/json';

app.use(createPinia());
app.use(router);

app.mount('#app');
