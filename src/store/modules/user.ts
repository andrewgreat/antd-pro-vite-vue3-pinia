import { defineStore } from "pinia";
import storage from "store";
import { getInfo, login, logout } from "@/api/login";
import { ACCESS_TOKEN } from "@/store/store-types";
import { welcome } from "@/utils/util";
import { CustemRouter } from "@/router/types";

export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      token: "",
      name: "",
      nickname: "",
      welcome: "",
      avatar: "",
      roles: [] as CustemRouter[],
      info: {},
    };
  },
  getters: {
    getRoles(state) {
      return () => {
        return state.roles;
      };
    },
  },
  actions: {
    setName({ name, nickname, welcome }) {
      this.name = name;
      this.nickname = nickname;
      this.welcome = welcome;
    },
    // 登录
    Login(userInfo) {
      // console.log(userInfo)
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            const result = response.data;
            console.log(result);
            //当前登录用户
            storage.set("login_name", result.name);
            // @ts-ignore
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000);
            this.token = result.token;
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            const result = response.data;

            if (result.role && result.role.permissions.length > 0) {
              const role = result.role;
              role.permissions = result.role.permissions;
              role.permissions.map((per) => {
                if (
                  per.actionEntitySet != null &&
                  per.actionEntitySet.length > 0
                ) {
                  per.actionList = per.actionEntitySet.map((action) => {
                    return action.action;
                  });
                }
              });
              role.permissionList = role.permissions.map((permission) => {
                return permission.permissionId;
              });
              this.roles = result.role;
              this.info = result;
            } else {
              reject(new Error("getInfo: roles must be a non-null array !"));
            }
            this.setName({
              name: result.username,
              nickname: result.name,
              welcome: welcome(),
            });
            this.avatar = result.avatar;

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    Logout() {
      return new Promise((resolve) => {
        logout("dadsfsdfd")
          .then(() => {
            this.token = "";
            this.roles = [];
            storage.remove(ACCESS_TOKEN);
            resolve(0);
          })
          .catch((err) => {
            console.log("logout fail:", err);
            // resolve()
          })
          .finally(() => {});
      });
    },

    // 加载所有字典数据
    // dictTypeData () {
    //   return new Promise((resolve, reject) => {
    //     sysDictTypeTree().then((data) => {
    //       if (data.success) {
    //         const result = data.data
    //         storage.set(DICT_TYPE_TREE_DATA, result)
    //         resolve(result)
    //       } else {
    //         // eslint-disable-next-line no-undef
    //         reject(new Error(data.message))
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 切换应用菜单
    // MenuChange ({ commit }, application) {
    //   return new Promise((resolve) => {
    //     sysMenuChange({ application: application.code }).then((res) => {
    //       const apps = { 'code': '', 'name': '', 'active': '', 'menu': '' }
    //       apps.active = true
    //       apps.menu = res.data
    //       // eslint-disable-next-line camelcase
    //       const all_app_menu = storage.get(ALL_APPS_MENU)
    //       // eslint-disable-next-line camelcase
    //       const new_false_all_app_menu = []
    //       // 先去除所有默认的，以为此时切换的即将成为前端缓存默认的应用
    //       all_app_menu.forEach(item => {
    //         if (item.active) {
    //           item.active = false
    //         }
    //         new_false_all_app_menu.push(item)
    //       })
    //       // 此时缓存中全部都是不默认的应用
    //       storage.set(ALL_APPS_MENU, new_false_all_app_menu)
    //       apps.name = application.name
    //       apps.code = application.code
    //       const applocationR = []
    //       applocationR.push(apps)
    //       storage.set(ALL_APPS_MENU, applocationR)
    //       resolve(res)
    //       const antDesignmenus = res.data
    //       store.dispatch('GenerateRoutes', { antDesignmenus }).then(() => {
    //         router.addRoutes(store.getters.addRouters)
    //       })
    //       // 切换应用刷新整体界面，暂且取消
    //       // window.location.reload()
    //     }).catch(() => {
    //       resolve()
    //     })
    //   })
    // }
  },
});
