import { defineStore } from "pinia";
import { TabPanesType } from "@/utils/types";

export const useTabsStore = defineStore("tabsStore", {
  state: () => {
    return {
      tabPanes: <TabPanesType[]>[],
      activeKey: "",
    };
  },
  persist: {
    // 开启持久化
    // 选择存储方式和内容
    storage: localStorage,
    paths: ["tabPanes","activeKey"],
  },
  actions: {
    pushTabs(tabPane) {
      if (!this.tabPanes.find((item) => item.key === tabPane.key)) {
        this.tabPanes.push(tabPane);
      }
    },
    removeTabs(tabPane) {
      this.tabPanes.forEach((item, index) => {
        if (item.key === tabPane.key) {
          this.tabPanes.splice(index, 1);
        }
      });
    },
    removeTabsByKey(key: string | MouseEvent) {
      this.tabPanes.forEach((item, index) => {
        if (item.key === key) {
          this.tabPanes.splice(index, 1);
        }
      });
    },
    updateTabs(tabPane) {
      this.tabPanes.forEach((item) => {
        if (item.key == tabPane.key) {
          item = Object.assign(item, tabPane);
        }
      });
    },
    updateTabsTitle(title = "") {
      const nowFullPath = location.hash.substring(1);
      this.tabPanes.forEach((item) => {
        if (item.key == nowFullPath) {
          item.title = title;
        }
      });
    },
    clearTabs() {
      this.tabPanes = [];
    },
  },
});
