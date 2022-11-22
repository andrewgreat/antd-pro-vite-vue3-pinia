import { computed } from "vue";
import { useAppStore } from "@/store/modules/app";

const app = useAppStore();
const appBase = {
  splitMenus: computed(() => app.splitMenus),
  layout: computed(() => app.layout),
  navTheme: computed(() => app.navTheme),
  primaryColor: computed(() => app.primaryColor),
  colorWeak: computed(() => app.colorWeak),
  fixedHeader: computed(() => app.fixedHeader),
  fixSiderbar: computed(() => app.fixSiderbar),
  contentWidth: computed(() => app.contentWidth),
  autoHideHeader: computed(() => app.autoHideHeader),
  isMobile: computed(() => app.isMobile),
  sideCollapsed: computed(() => app.sideCollapsed),
  multiTab: computed(() => app.multiTab),
  isTopMenu: computed(() => appBase.layout === "top"),
  isSideMenu: () => {
    return !appBase.isTopMenu;
  },
};

export { appBase };
