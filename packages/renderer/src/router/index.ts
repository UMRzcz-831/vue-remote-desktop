import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
    name: 'layout',
    component: () => import('../layout/layout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home/index.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login/index'),
      },
      {
        path: '/devices',
        name: 'devices',
        component: () => import('../views/Devices/index'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
