import './styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vue3GoogleLogin from 'vue3-google-login';
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query';

import App from './App.vue';
import { router } from './router';
import { config } from './helpers/config';

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false
      }
    }
  }
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(vue3GoogleLogin, {
  clientId: config.GOOGLE_CLIENT_ID
});
app.mount('#app');
