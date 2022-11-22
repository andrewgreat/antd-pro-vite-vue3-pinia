import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import type { Router } from 'vue-router';
import 'nprogress/css/nprogress.css'
import {constantRouterMap} from '@/config/router.config';
// import {setupAfterEach, setupBeforeEach} from '@/router/routerGuard';
console.log('main.ts...','load router')
const router: Router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRouterMap as RouteRecordRaw[]
});

//路由导航冗余报错（路由重复）
const originalPush = router.push;
router.push = function push(location: any) {
  return originalPush.call(this, location).catch((err: any) => err);
};

// setupBeforeEach(router)
//
// setupAfterEach(router)

export default router;
