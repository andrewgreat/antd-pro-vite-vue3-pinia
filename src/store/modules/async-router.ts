/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { defineStore } from "pinia";
import { constantRouterMap } from "@/config/router.config";
import { generatorDynamicRouter } from "@/router/generator-routers";

export const useRouteStore = defineStore("routeStore", {
  state: () => {
    return {
      routers: constantRouterMap,
      addRouters: [],
    };
  },
  actions: {
    setRoutes(routers) {
      this.addRouters = routers;
      this.routers = constantRouterMap.concat(routers);
    },
    GenerateRoutes(data) {
      return new Promise((resolve) => {
        const { token } = data;
        generatorDynamicRouter(token).then((routers) => {
          this.setRoutes(routers);
          // console.log('GenerateRoutes',routers)
          resolve(token);
        });
      });
    },
  },
});
