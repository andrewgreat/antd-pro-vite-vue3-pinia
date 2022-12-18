<template>
  <a-config-provider :locale="antLocale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ConfigProvider } from "ant-design-vue";
import { useAppStore } from "@/store/modules/app";
import { domTitle, setDocumentTitle } from "@/utils/domUtil";
export default defineComponent({
  name: "App",
  setup() {
    const { t, getLocaleMessage } = useI18n();
    const appStore = useAppStore();
    const route = useRoute();

    console.log("app.vue...");
    const antLocale = computed(() => {
      const { title } = route.meta;
      // @ts-ignore
      title && setDocumentTitle(`${t(title)}-${domTitle}`);

      return getLocaleMessage(appStore.lang).antLocale;
    });
    const getPopupContainer = (el: Element, dialogContext: any) => {
      if (dialogContext) {
        return dialogContext.getDialogWrap();
      }
      return document.body;
    };
    onMounted(() => {
      ConfigProvider.config({
        theme: { primaryColor: appStore.theme.primaryColor },
      });
    });
    return {
      getPopupContainer,
      antLocale,
    };
  },
});
</script>

<style lang="less">
@import "./style/index.less";
</style>
