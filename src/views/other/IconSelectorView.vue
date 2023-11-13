<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <icon-selector v-model="currentSelectedIcon" @update:modelValue="handleIconChange" />

    <a-divider />
    <p>测试 IconSelector 组件 v-model 功能</p>
    <a-button @click="changeIcon('down-outlined')">改变 down-outlined</a-button>
    <a-divider type="vertical" />
    <a-button @click="changeIcon('read-outlined')">改变 read-outlined</a-button>
  </a-card>
</template>

<script setup lang="ts" name="IconSelectorView">
import { defineComponent, ref, nextTick } from "vue";
import { message } from "ant-design-vue";
import IconSelector from "@/components/IconSelector";

const currentSelectedIcon = ref("pause-circle-outlined");

const scrollTo = (elementId) => {
  document.getElementById(elementId)?.scrollIntoView({ block: "center" });
};

function handleIconChange(icon) {
  message.success(`选中图标<${icon} />`);
}
function changeIcon(icon) {
  currentSelectedIcon.value = icon;
  nextTick(() => {
    scrollTo(icon);
  });
}
</script>
