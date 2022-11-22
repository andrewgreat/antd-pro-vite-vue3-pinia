<template>
  <a-list itemLayout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <template #title>
          <a>风格配色</a>
        </template>
        <template #description>
          <span> 整体风格配色设置 </span>
        </template>
      </a-list-item-meta>
      <template #actions>
        <a-switch
          v-model:checked="navChecked"
          checkedChildren="暗色"
          unCheckedChildren="白色"
          @change="onChange"
        />
      </template>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #title>
          <a>主题色</a>
        </template>
        <template #description>
          <span>
            页面风格配色： <a>{{ colorFilter(primaryColor) }}</a>
          </span>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useAppStore } from "@/store/modules/app";
import colorConfig from "@/config/colorConfig";
import { NAV_THEME } from "@/store/store-types";

const themeMap = {
  dark: "暗色",
  light: "白色",
};

export default defineComponent({
  name: "CustomSettings",

  setup() {
    const app = useAppStore();
    const { colorList } = colorConfig;
    const navTheme = app.navTheme;
    const primaryColor = app.primaryColor;
    const navChecked = ref((navTheme === "dark" && true) || false);

    const themeFilter = (theme) => {
      return themeMap[theme];
    };

    const colorFilter = computed(() => {
      return (color) => {
        const c = colorList.find((o) => o.color === color);
        return c && c.key;
      };
    });

    const onChange = (checked) => {
      if (checked) {
        app.navTheme = NAV_THEME.DARK;
      } else {
        app.navTheme = NAV_THEME.LIGHT;
      }
    };

    return {
      navChecked,
      primaryColor,
      themeFilter,
      colorFilter,
      onChange,
    };
  },
});
</script>
