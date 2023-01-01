import { App } from "vue";
import axios, { AxiosInstance } from "axios";
import store from "@/store";
import { useUserStore } from "@/store/modules/user";
import storage from "store";
import { notification } from "ant-design-vue";
import { ACCESS_TOKEN } from "@/store/store-types";

const userStore = useUserStore(store);

const codeMap = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  304: "协商缓存",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  // API 请求的默认前缀
  baseURL: "",
  timeout: 3000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN);
    const status = error.response.status;
    const description = codeMap[status];

    notification.error({
      message: "请求错误:" + status,
      description: description,
    });

    if (status === 401 && !(data.result && data.result.isLogin)) {
      if (token) {
        userStore.Logout().then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 300);
        });
      }
    }
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token && config.headers) {
    config.headers["Access-Token"] = token;
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  return response.data;
}, errorHandler);

const installer = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  installed: false,
  install(app: App, request: AxiosInstance) {
    if (this.installed) {
      return;
    }
    this.installed = true;

    if (!request) {
      // eslint-disable-next-line no-console
      console.error("You have to install axios");
      return;
    }

    app.config.globalProperties["axios"] = request;
    app["axios"] = {
      get: () => {
        return request;
      },
    };
    app.config.globalProperties["$http"] = request;
    app["$http"] = {
      get: () => {
        return request;
      },
    };
  },
};

const VueAxios = {
  vm: {},
  install(app: App) {
    app.use(installer, request);
  },
};

export default request;
export { VueAxios, request as axios };
