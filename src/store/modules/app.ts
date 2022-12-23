import { defineStore } from "pinia";
import store from "@/store";
import settings from "@/config/defaultSettings";
import { loadLanguageAsync } from "@/locales";

export const useAppStore = defineStore("appStore", {
  state: () => {
    return {
      sideCollapsed: false,
      isMobile: false,
      splitMenus: settings.splitMenus,
      navTheme: settings.navTheme,
      layout: settings.layout,
      theme: {
        primaryColor: settings.primaryColor,
      },
      contentWidth:
        settings.layout === "side" ? "Fluid" : settings.contentWidth,
      fixedHeader: settings.fixedHeader,
      fixSiderbar: settings.fixSiderbar,
      autoHideHeader: settings.autoHideHeader,
      colorWeak: settings.colorWeak,
      multiTab: settings.multiTab,
      lang: settings.lang,
      _antLocale: {},
    };
  },
  persist: {
    // 开启持久化
    // 选择存储方式和内容
    storage: localStorage,
    paths: ["lang", "theme"],
  },
  getters: {},
  actions: {
    app_language(lang: string, antd = {}) {
      this.lang = lang;
      this._antLocale = antd;
    },
    setLang(lang: string) {
      return new Promise((resolve, reject) => {
        this.app_language(lang);
        loadLanguageAsync(lang)
          .then(() => {
            resolve(lang);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}
