import { CustemRouter } from './types'
import BasicLayout from '@/layouts/BasicLayout.vue';
import RouteView from '@/layouts/RouteView.vue';

export const examples: CustemRouter[] = [
  {
    path: "/user",
    hideInMenu: true,
    icon: "user",
    title: "用户",
    component: () =>
      import( "@/layouts/UserLayout.vue"),
    children: [
      {
        path: "/user",
        redirect: "/user/login"
      },
      {
        path: "/user/login",
        name: "login",
        icon: "login",
        title: "登录",
        component: () =>
          import("@/views/user/Login.vue")
      },
      {
        path: "/user/register",
        name: "register",
        icon: "login",
        title: "注册",
        component: () =>
          import("@/views/user/Login.vue")
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/',
    name: 'index',
    meta: { title: 'Home' },
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: 'Dashboard', icon: 'DashboardOutlined' },
        redirect: '/dashboard/monitor',
        component: RouteView,
        children: [
          {
            path: 'workspace',
            name: 'workspace',
            meta: { title: 'Workspace', icon: 'icon-antdesign' },
            component: () => import('@/views/page1.vue'),
          },
          {
            path: 'monitor',
            name: 'monitor',
            meta: { title: 'Monitor', icon: 'icon-icon-test' },
            component: () => import('@/views/page2.vue'),
          },
        ],
      },
      {
        path: '/form',
        name: 'form',
        meta: { title: 'Form', icon: 'FormOutlined' },
        redirect: '/form/basic-form',
        component: RouteView,
        children: [
          {
            path: 'basic-form',
            name: 'basic-form',
            meta: { title: 'Basic Form' },
            component: () => import('@/views/page1.vue'),
          },
        ],
      },
      {
        path: '/single',
        name: 'single',
        meta: { title: 'Single', icon: 'SettingOutlined' },
        component: () => import('@/views/page1.vue'),
      },
    ],
  },
  {
    path: "/403",
    name: "403",
    hideInMenu: true,
    component: () => import('@/views/exception/403.vue'),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    hideInMenu: true,
    component: () => import('@/views/exception/404.vue'),
  }
] as CustemRouter[];

