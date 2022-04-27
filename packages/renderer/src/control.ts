import { createApp } from 'vue';
import router from './router/control';
import App from './App.vue';




createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {

  });
