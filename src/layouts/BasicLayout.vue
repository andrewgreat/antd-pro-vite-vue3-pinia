<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    :menu-data="menuData"
    v-bind="settings"
    :loading="loading"
    :breadcrumb="{ routes: breadcrumb }"
    iconfont-url="//at.alicdn.com/t/font_2804900_nzigh7z84gc.js"
    :collapsedButtonRender="false"
    :locale="t"
  >
    <template #menuHeaderRender>
      <a>
        <img src="/public/logo.svg" />
        <h1>{{ settings.title }}</h1>
      </a>
    </template>
    <!-- only work layout `Side` -->
    <template #headerContentRender>
      <a
        :style="{ margin: '0 8px', fontSize: '20px' }"
        @click="handleCollapsed"
      >
        <a-tooltip :title="baseState.collapsed ? '展开菜单' : '收起菜单'">
          <menu-unfold-outlined v-if="baseState.collapsed" />
          <menu-fold-outlined v-else />
        </a-tooltip>
      </a>
      <div
        :style="{ display: 'inline', margin: '0 8px', fontSize: '20px' }"
        @click="onRefresh"
      >
        <a-tooltip title="刷新页面">
          <reload-outlined />
        </a-tooltip>
      </div>
    </template>

    <!-- custom right-content -->
    <template #rightContentRender>
      <right-content />
    </template>

    <!-- custom breadcrumb itemRender  -->
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ $t(route.breadcrumbName) }}
      </span>
      <router-link v-else :to="{ path: route.path, params }">
        {{ $t(route.breadcrumbName) }}
      </router-link>
    </template>
    <setting-drawer v-model="settings" />

    <!-- content begin -->
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>

    <!-- content end -->
    <pro-global-footer />
  </pro-layout>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  shallowRef,
  watchEffect,
  onMounted,
  nextTick,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import {
  getMenuData,
  clearMenuItem,
  GlobalFooter,
} from "@ant-design-vue/pro-layout";
import type { RouteContextProps } from "@ant-design-vue/pro-layout";
import defaultSettings from "@/config/defaultSettings";
import RightContent from "@/components/GlobalHeader/RightContent.vue";
import ProGlobalFooter from "@/components/GlobalFooter/index.vue";
import SettingDrawer from "@/components/SettingDrawer/index.vue";

export default defineComponent({
  name: "BasicLayout",
  components: {
    ProGlobalFooter,
    RightContent,
    GlobalFooter,
    SettingDrawer,
  },
  setup() {
    const loading = shallowRef(false);
    let watermarkContent = "Pro Layout";
    const router = useRouter();
    const app = useAppStore();
    const { t } = useI18n();
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
    // console.log('BasicLayout..',menuData)
    const baseState = reactive<Omit<RouteContextProps, "menuData">>({
      selectedKeys: [],
      openKeys: [],
      // default
      collapsed: false,
    });

    const settings = ref({
      splitMenus: app.splitMenus,
      title: defaultSettings.title,
      // 主题 'dark' | 'light' | 'realDark'
      navTheme: app.navTheme,
      // 布局类型
      layout: app.layout, // 'side', 'top', 'mix'
      fixedHeader: app.fixedHeader,
      fixSiderbar: app.fixSiderbar,
      // CONTENT_WIDTH_TYPE
      contentWidth: app.contentWidth,
      // 主色调
      primaryColor: app.primaryColor,
      colorWeak: app.colorWeak,
      hideHintAlert: false,
      hideCopyButton: false,
    });

    const showRouter = ref(true);
    const onRefresh = () => {
      // emitter.all.clear()
      window.location.reload();
      showRouter.value = false;
      nextTick(() => (showRouter.value = true));
    };

    const breadcrumb = computed(() =>
      router.currentRoute.value.matched.concat().map((item) => {
        return {
          path: item.path,
          breadcrumbName: item.meta.title || "",
        };
      })
    );

    const handleCollapsed = () => {
      baseState.collapsed = !baseState.collapsed;
      app.sideCollapsed = baseState.collapsed;
    };
    watchEffect(() => {
      if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat();
        baseState.selectedKeys = matched
          .filter((r) => r.name !== "index")
          .map((r) => r.path);
        baseState.openKeys = matched
          .filter((r) => r.path !== router.currentRoute.value.path)
          .map((r) => r.path);
      }
    });
    function handlePageLoadingClick() {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 2000);
    }
    onMounted(() => {
      setTimeout(() => {
        watermarkContent = "New Mark";
      }, 2000);
    });
    return {
      t,
      watermarkContent,
      menuData,
      baseState,
      settings,
      loading,
      breadcrumb,
      onRefresh,
      handlePageLoadingClick,
      handleCollapsed,
    };
  },
});
</script>
<style lang="less" scoped></style>
