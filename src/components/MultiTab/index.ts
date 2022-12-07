// import { emit } from "vue";
import MultiTab from "@/components/MultiTab/MultiTab.vue";

const api = {
  install : function (app) {
    if (app.config.globalProperties.$multiTab) {
      return;
    }
      //  api.instance = events;
    app.config.globalProperties.$multiTab = api;
    app.component("multi-tab", MultiTab);
  }
};

 
export default api;
