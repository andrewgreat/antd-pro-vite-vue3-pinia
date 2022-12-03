import { defineStore } from "pinia";
import storage from "store";
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
      contentWidth:
        settings.layout === "side" ? "Fluid" : settings.contentWidth,
      fixedHeader: settings.fixedHeader,
      fixSiderbar: settings.fixSiderbar,
      autoHideHeader: settings.autoHideHeader,
      primaryColor: settings.primaryColor,
      colorWeak: settings.colorWeak,
      multiTab: settings.multiTab,
      lang: "zh-CN",
      _antLocale: {},
    };
  },
  getters: {

  },
  actions: {
    app_language(lang: string, antd = {}) {
      this.lang = lang;
      this._antLocale = antd;
      storage.set("app_language", lang);
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
