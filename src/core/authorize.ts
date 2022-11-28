import type { App } from "vue";
import { useUserStore } from "@/store/modules/user";

export const PERMISSION_ENUM = {
  add: { key: "add", label: "新增" },
  delete: { key: "delete", label: "删除" },
  edit: { key: "edit", label: "修改" },
  query: { key: "query", label: "查询" },
  get: { key: "get", label: "详情" },
  enable: { key: "enable", label: "启用" },
  disable: { key: "disable", label: "禁用" },
  import: { key: "import", label: "导入" },
  export: { key: "export", label: "导出" },
};

/**
 * <a-button v-if="$auth('form.edit')">Button</a-button>
 * @param permissions
 */
export const useAuth = function (permissions) {
  const userStore = useUserStore();
  const [permission, action] = permissions.split(".");
  const permissionList = userStore.getRoles().permissions;
  return (
    permissionList
      .find((val) => {
        return val.permissionId === permission;
      })
      .actionList.findIndex((val) => {
        return val === action;
      }) > -1
  );
};

export const usePermEnum = function (val) {
  let result = PERMISSION_ENUM;
  val &&
    val.split(".").forEach((v) => {
      result = (result && result[v]) || null;
    });
  return result;
};

export function setupAuth(app: App<Element>) {
  app.config.globalProperties.$auth = useAuth;
  app["$auth"] = {
    get: (permissions) => useAuth(permissions),
  };
  app.config.globalProperties.$enum = usePermEnum;
  app["$auth"] = {
    get: (val) => usePermEnum(val),
  };
}

export default setupAuth;
