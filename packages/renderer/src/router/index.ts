import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    name: 'layout',
    component: () => import('../layout/layout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home/index'),
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
