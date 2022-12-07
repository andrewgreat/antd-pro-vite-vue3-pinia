import { App } from "vue";
import { notification } from "ant-design-vue";
import router from "@/router";
import { useUserStore } from "@/store/modules/user";
import { useRouteStore } from "@/store/modules/async-router";
// import { useI18n } from 'vue-i18n';
import storage from "store";
import NProgress from "nprogress";
// import '@/components/NProgress/nprogress.less'
import { setDocumentTitle, domTitle } from "@/utils/domUtil";
import { ACCESS_TOKEN } from "@/store/store-types";

export default function permission(app: App<Element>) {
  console.log("main.ts...", "permission");
  NProgress.configure({ showSpinner: false }); // NProgress Configuration
  const userStore = useUserStore();
  const routeStore = useRouteStore();
  const allowList = ["login", "register", "registerResult"]; // no redirect allowList
  const loginRoutePath = "/user/login";
  const defaultRoutePath = "/dashboard/workplace";

  const GetInfo = () => userStore.GetInfo();

  // const { t } = useI18n()

  router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    // @ts-ignore
    to.meta &&
      typeof to.meta.title !== "undefined" &&
      setDocumentTitle(`${to.meta.title} - ${domTitle}`);
    /* has token */
    if (storage.get(ACCESS_TOKEN)) {
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath });
        NProgress.done();
      } else {
        // check login user.roles is null
        if (userStore.roles.length === 0) {
          // request login userInfo
          GetInfo()
            .then((res) => {
              const roles = res && res.role;
              // generate dynamic router
              routeStore.GenerateRoutes({ roles }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                routeStore.addRouters.forEach((r) => {
                  router.addRoute(r);
                });
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(
                  <string>from.query.redirect || to.path
                );
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true });
                } else {
                  // 跳转到目的路由
                  next({ path: redirect });
                }
              });
            })
            .catch(() => {
              notification.error({
                message: "错误",
                description: "请求用户信息失败，请重试",
              });
              // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
              userStore.Logout().then(() => {
                next({
                  path: loginRoutePath,
                  query: { redirect: to.fullPath },
                });
              });
            });
        } else {
          next();
        }
      }
    } else {
      if (allowList.includes(<string>to.name)) {
        // 在免登录名单，直接进入
        next();
      } else {
        next({ path: loginRoutePath, query: { redirect: to.fullPath } });
        NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
      }
    }
  });

  router.afterEach(() => {
    NProgress.done(); // finish progress bar
  });
}
