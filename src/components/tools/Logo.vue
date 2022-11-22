<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <svg-icon name="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from '@/components/tools/SvgIcon.vue'

export default defineComponent({
  name: 'Logo',
  components: {
    SvgIcon,
  },
  props: {
    title: {
      type: String,
      default: 'Ant Design Pro',
      required: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false,
    },
  }
});
</script>
<style lang="less" scoped>

</style>
