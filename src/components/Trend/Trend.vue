<template>
  <div :class="[prefixCls, reverseColor && 'reverse-color' ]">
    <span>
      <slot name="term"></slot>
      <span class="item-text">
        <slot></slot>
      </span>
    </span>
    <span :class="[flag]">
      <CaretUpOutlined v-if="flag==='up'"/>
      <CaretDownOutlined v-else/>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Trend',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-trend'
    },
    /**
     * 上升下降标识：up|down
     */
    flag: {
      type: String,
      required: true
    },
    /**
     * 颜色反转
     */
    reverseColor: {
      type: Boolean,
      default: false
    }
  }
})

</script>

<style lang="less" scoped>
  @import "index";
</style>
