import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'control',
    component: () => import('../views/Control/index.vue'),
  }

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
