<script lang="tsx">
import { defineComponent, ref, watch, getCurrentInstance, provide } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { useTabsStore } from "@/store/modules/tabs";
import settings from "@/config/defaultSettings";
import { TabPanesType } from "@/utils/types";
import "./index.less";

export default defineComponent({
  name: "MultiTab",
  setup() {
    const proxy = getCurrentInstance()!.proxy;
    const router = useRouter();
    const { t } = useI18n();
    const tabsStore = useTabsStore();

    const tabPanes = ref<TabPanesType[]>([]);
    const activeKey = ref<string>("");

    const selectedLastPath = function () {
      activeKey.value = tabPanes.value[tabPanes.value.length - 1].key;
    };

    const remove = function (targetKey: string | MouseEvent) {
      tabPanes.value = tabPanes.value.filter((pane) => pane.key !== targetKey);
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      tabsStore.removeTabsByKey(targetKey);
      if (!tabPanes.value.find((pane) => pane.key === activeKey.value)) {
        selectedLastPath();
      }
    };

    const onEdit = function (targetKey: string | MouseEvent, action: string) {
      if (action === "remove") remove(targetKey);
    };

    // content menu
    const closeThat = function (e: string | MouseEvent) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (tabPanes.value.length > 1) {
        remove(e);
      } else {
        message.info("这是最后一个标签了, 无法被关闭");
      }
    };
    const closeLeft = function (e: string | MouseEvent) {
      const currentIndex = tabPanes.value.findIndex((pane) => pane.key === e);
      if (currentIndex > 0) {
        tabPanes.value.forEach((pane, index) => {
          if (index < currentIndex && pane.closable) {
            remove(pane.key);
          }
        });
      } else {
        message.info("左侧没有标签");
      }
    };
    const closeRight = function (e: string) {
      const currentIndex = tabPanes.value.findIndex((pane) => pane.key === e);
      if (currentIndex > 0) {
        tabPanes.value.forEach((pane, index) => {
          if (index > currentIndex && pane.closable) {
            remove(pane.key);
          }
        });
      } else {
        message.info("右侧没有标签");
      }
    };
    const closeAll = function (e: string) {
      tabPanes.value.forEach((pane, index) => {
        if (pane.closable) {
          remove(pane.key);
        }
      });
    };
    const closeMenuClick = function (key: string, route: any) {
      switch (key) {
        case "closeThat":
          closeThat(route);
          break;
        case "closeRight":
          closeRight(route);
          break;
        case "closeLeft":
          closeLeft(route);
          break;
        case "closeAll":
          closeAll(route);
          break;
        default:
          console.log("没有这个方法");
      }
    };

    const created = function () {
      // provide 全局事件方法,用于页面内控制tab标签
      provide("multiTab.open", (val) => {
        if (!val) {
          throw new Error(`multi-tab: open tab ${val} err`);
        }
        activeKey.value = val;
      });
      provide("multiTab.close", (val: any) => {
        if (!val) {
          closeThat(activeKey.value);
          return;
        }
        closeThat(val);
      });
      provide("multiTab.rename", ({ key, name }) => {
        console.log("rename", key, name);
        try {
          const item = tabPanes.value.find((pane) => pane.key === key);
          item!.title = name;
          proxy!.$forceUpdate();
        } catch (e) {
          console.error(e);
        }
      });
      // #endregion
      if (tabsStore.tabPanes && tabsStore.tabPanes.length > 0) {
        tabsStore.tabPanes.forEach((item) => {
          //如果是首页，更新标题为首页
          if (item.key === settings.homePage && item.title !== "menu.home") {
            item.title = "menu.home";
            item.closable = false;
          }
          tabPanes.value.push(item);
        });
      } else {
        const fullPath = router.currentRoute.value.fullPath;
        const isHomePage = fullPath === settings.homePage;
        const tabTitle = isHomePage
          ? "menu.home"
          : router.currentRoute.value.meta.customTitle ||
            router.currentRoute.value.meta.title;
        const pane = {
          key: fullPath,
          title: tabTitle,
          isHomePage: isHomePage,
          closable: tabPanes.value.length > 1 || !isHomePage,
        };
        tabPanes.value.push(pane);
        tabsStore.pushTabs(pane);
      }

      selectedLastPath();
    };

    watch(
      () => router.currentRoute.value,
      (newVal) => {
        activeKey.value = newVal.fullPath;
        if (!tabPanes.value.find((pane) => pane.key === activeKey.value)) {
          const isHomePage = newVal.fullPath === settings.homePage;
          const tabTitle = isHomePage
            ? "menu.home"
            : newVal.meta.customTitle || newVal.meta.title;
          const pane = {
            key: newVal.fullPath,
            title: tabTitle,
            isHomePage: isHomePage,
            closable: !isHomePage,
          };
          tabPanes.value.push(pane);
          tabsStore.pushTabs(pane);
        }
      }
    );

    watch(activeKey, (newPathKey) => {
      router.push({ path: newPathKey });
    });

    // render
    const renderTabPane = function (title: string, keyPath: string) {
      const menu = renderTabPaneMenu(keyPath);
      return (
        <a-dropdown overlay={menu} trigger={["contextmenu"]}>
          <span style={{ userSelect: "none" }}>{title}</span>
        </a-dropdown>
      );
    };
    const renderTabPaneMenu = function (e: any) {
      return (
        <a-menu onClick={({ key, item, domEvent }) => closeMenuClick(key, e)}>
          <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭全部</a-menu-item>
        </a-menu>
      );
    };

    const render = function () {
      const panes = tabPanes.value.map((pane) => {
        return (
          <a-tab-pane
            style={{ height: 0 }}
            tab={renderTabPane(t(pane.title), pane.key)}
            key={pane.key}
            v-model={[pane.closable, "closable"]}
          ></a-tab-pane>
        );
      });

      return (
        <div class="ant-pro-multi-tab">
          <div class="ant-pro-multi-tab-wrapper">
            <a-tabs
              hideAdd
              type={"editable-card"}
              v-model={[activeKey.value, "activeKey"]}
              tabBarStyle={{
                background: "#FFF",
                margin: 0,
                paddingLeft: "16px",
                paddingTop: "1px",
              }}
              onEdit={onEdit}
            >
              {panes}
            </a-tabs>
          </div>
        </div>
      );
    };

    created();

    return () => render();
  },
});
</script>
