<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <icon-selector v-model="currentSelectedIcon" @change="handleIconChange" />

    <a-divider />
    <p>测试 IconSelector 组件 v-model 功能</p>
    <a-button @click="changeIcon('down-outlined')">改变 down-outlined</a-button>
    <a-divider type="vertical" />
    <a-button @click="changeIcon('cloud-download-outlined')"
      >改变 cloud-download-outlined</a-button
    >
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { message } from "ant-design-vue";
import IconSelector from "@/components/IconSelector";

export default defineComponent({
  name: "IconSelectorView",
  components: {
    IconSelector,
  },
  setup() {
    const currentSelectedIcon = ref("pause-circle-outlined");
    function handleIconChange(icon) {
      console.log("change Icon", icon);
      message.info(`选中图标<${icon} />`)
    }
    function changeIcon(type) {
      currentSelectedIcon.value = type;
    }
    return {
      currentSelectedIcon,
      handleIconChange,
      changeIcon,
    };
  },
});
</script>
