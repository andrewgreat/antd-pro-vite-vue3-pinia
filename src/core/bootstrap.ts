import { useAppStore } from "@/store/modules/app";
import storage from "store";
import defaultSettings from "@/config/defaultSettings";

export default function Initializer() {
  console.log("main.ts...", "bootstrap");
  let app = useAppStore();
  app.layout = storage.get("layout", defaultSettings.layout);
  app.fixedHeader = storage.get("fixed_header", defaultSettings.layout);
  app.fixSiderbar = storage.get("fixed_sidebar", defaultSettings.layout);
  app.contentWidth = storage.get("content_width", defaultSettings.layout);
  app.autoHideHeader = storage.get("auto_hide_header", defaultSettings.layout);
  app.navTheme = storage.get("nav_theme", defaultSettings.layout);
  app.colorWeak = storage.get("color_weak", defaultSettings.layout);
  app.primaryColor = storage.get("primary_color", defaultSettings.layout);
  app.multiTab = storage.get("multi_tab", defaultSettings.layout);
  app.splitMenus = storage.get("split_menus", defaultSettings.layout);
  // store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))

  app.setLang(storage.get("app_language", "en-US")).then(() => {});
  // last step
}
