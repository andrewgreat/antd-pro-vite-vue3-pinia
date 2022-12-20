import { inject } from "vue";
import events from './events';
// import events from "./events";
import MultiTab from "./MultiTab.vue";

const api = {
  /**
   * open new tab on route fullPath
   * @param config
   */
  open: function (config) {
    events.emit("multiTab_open", config);
  },
  rename: function (key, name) {
    events.emit("multiTab_rename", { key: key, name: name });
  },
  /**
   * close current page
   */
  closeCurrentPage: function () {
    events.emit("multiTab_close");
  },
  /**
   * close route fullPath tab
   * @param config
   */
  close: function (config) {
    events.emit("multiTab_close", config);
  },

  install: function (app) {
    if (app.config.globalProperties.$multiTab) {
      return;
    }
    //  api.instance = events;
    app.config.globalProperties.$multiTab = api;
    app.component("multi-tab", MultiTab);
  },
};

export default api;
