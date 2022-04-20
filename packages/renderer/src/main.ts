import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import { createPinia } from 'pinia';
import ipcRendererSample from './mainModules/ipcRendererSample';
import fsExample from './mainModules/builtinModuleSample';

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    window.removeLoading();
    ipcRendererSample();
    fsExample();
  });
