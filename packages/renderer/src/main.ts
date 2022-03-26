import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ipcRendererSample from './mainModules/ipcRendererSample'
import fsExample from './mainModules/builtinModuleSample'
import sqliteExample from './mainModules/nodeModulesSample'

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    window.removeLoading()
    ipcRendererSample()
    fsExample()
    sqliteExample()
  })
