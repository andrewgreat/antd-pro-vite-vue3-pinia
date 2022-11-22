import NProgress from 'nprogress';
import findLast from 'lodash/findLast';
import {check, isLogin} from '@/utils/auth';
import {notification} from 'ant-design-vue';
import type { Router } from 'vue-router';

export const setupBeforeEach = (router: Router) => {
  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      NProgress.start();
    }
    const record = findLast(to.matched, record => record.meta.authority);
    console.log(record)
    // @ts-ignore
    if (record && record.meta && !check(record.meta.authority)) {
      if (!isLogin() && to.path !== '/user/login') {
        next({
          path: '/user/login'
        });
      } else if (to.path !== '/403') {
        notification.error({
          message: '403',
          description: '您没有权限访问该页面，请联系管理员咨询'
        });
        next({
          path: '/403'
        });
      }
      NProgress.done();
    }
    next();
  })
}

export const setupAfterEach = (router: Router) => {
  router.afterEach(() => {
    NProgress.done() // finish progress bar
  })
}
