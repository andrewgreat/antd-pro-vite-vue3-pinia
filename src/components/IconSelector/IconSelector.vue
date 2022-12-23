<template>
  <div :class="prefixCls">
    <a-tabs v-model:activeKey="currentTab" @change="handleTabChange">
      <a-tab-pane v-for="v in icons" :tab="v.title" :key="v.key">
        <ul>
          <li
            v-for="(icon, key) in v.icons"
            :key="`${v.key}-${key}`"
            :class="{ active: selectedIcon == icon }"
            @click="handleSelectedIcon(icon)"
          >
            <component :is="icon" :style="{ fontSize: '36px' }" />
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import icons from "./icons";

export default defineComponent({
  name: "IconSelect",
  props: {
    prefixCls: {
      type: String,
      default: "ant-pro-icon-selector",
    },
    modelValue: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const selectedIcon = ref(props.modelValue);
    const currentTab = ref("directional");

    function handleSelectedIcon(icon) {
      selectedIcon.value = icon;
      emit("change", icon);
    }
    function handleTabChange(activeKey) {
      currentTab.value = activeKey;
    }
    function autoSwitchTab() {
      icons.some(
        (item) =>
          item.icons.some((icon) => icon == props.modelValue) &&
          (currentTab.value = item.key)
      );
    }

    watch(
      () => props.modelValue,
      (newval) => {
        selectedIcon.value = newval;
        autoSwitchTab();
      }
    );

    props.modelValue && autoSwitchTab();

    return {
      selectedIcon,
      currentTab,
      icons,
      handleSelectedIcon,
      handleTabChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../index.less";

ul {
  list-style: none;
  padding: 0;
  overflow-y: scroll;
  height: 40vh;

  li {
    display: inline-block;
    padding: @padding-sm;
    margin: 3px 0;
    border-radius: @border-radius-base;

    &:hover,
    &.active {
      box-shadow: 0px 0px 5px 2px var(--ant-primary-color);
      cursor: pointer;
      color: @white;
      background-color: var(--ant-primary-color);
    }
  }
}
</style>
