import { createApp } from "vue";
import App from "./App.vue";
import store from "@/store/index";
import "vite-plugin-svg-icons/register";
import i18n from "@/locales";
import bootstrap from "@/core/bootstrap";
import { lazyApp } from "@/core/lazy_use";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import permission from "./permission";
import router from "@/router";
import "./style/global.less"; // global style

const app = createApp(App);
// app.use(store);

console.log("main.ts...");
app
  .use(store)
  .use(router)
  .use(i18n)
  .use(ProLayout)
  .use(PageContainer)
  .component("page-header-wrapper", PageContainer)
  .use(lazyApp)
  .use(bootstrap)
  .use(permission)
  .mount("#app");
