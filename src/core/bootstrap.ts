import { useAppStore } from "@/store/modules/app";
import storage from "store";
import defaultSettings from "@/config/defaultSettings";

export default function Initializer() {
  console.log("main.ts...", "bootstrap");
  const appStore = useAppStore();
  appStore.layout = storage.get("layout", defaultSettings.layout);
  appStore.fixedHeader = storage.get("fixed_header", defaultSettings.fixedHeader);
  appStore.fixSiderbar = storage.get("fixed_sidebar", defaultSettings.fixSiderbar);
  appStore.contentWidth = storage.get("content_width", defaultSettings.contentWidth);
  appStore.autoHideHeader = storage.get("auto_hide_header", defaultSettings.autoHideHeader);
  appStore.navTheme = storage.get("nav_theme", defaultSettings.navTheme);
  appStore.colorWeak = storage.get("color_weak", defaultSettings.colorWeak);
  appStore.primaryColor = storage.get("primary_color", defaultSettings.primaryColor);
  appStore.multiTab = storage.get("multi_tab", defaultSettings.multiTab);
  appStore.splitMenus = storage.get("split_menus", defaultSettings.splitMenus);
  // store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))

  appStore.setLang(storage.get("app_language", "en-US")).then(() => {});
  // last step
}
