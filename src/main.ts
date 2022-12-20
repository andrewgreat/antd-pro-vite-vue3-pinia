import { createApp } from "vue";
import App from "./App.vue";
import {setupStore} from "@/store";
import "vite-plugin-svg-icons/register";
import {setupI18n} from "@/locales";
import bootstrap from "@/core/bootstrap";
import { lazyApp } from "@/core/lazy_use";
import permission from "./permission";
import {setupRouter} from "@/router";
import "./style/global.less"; // global style
import "ant-design-vue/dist/antd.variable.css";

const app = createApp(App);

console.log("main.ts...");

setupStore(app);

setupRouter(app);

setupI18n(app);

app

  .use(lazyApp)
  // .use(bootstrap)
  .use(permission)
  .mount("#app");
