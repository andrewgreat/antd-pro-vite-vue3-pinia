<template>
  <div :class="prefixCls" :style="{ width: barWidth, transition: '0.3s all' }">
    <div style="float: left">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'FooterToolBar',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-footer-toolbar'
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    siderWidth: {
      type: Number,
      default: undefined
    },
    extra: {
      type: [String, Object],
      default: ''
    }
  },
 setup(props){
    const {isMobile, collapsed, siderWidth}= props
    const barWidth = computed(() => isMobile ? undefined : `calc(100% - ${collapsed ? 80 : siderWidth || 256}px)`)

    return{
      barWidth
    }
  }
})
</script>

<style lang="less" scoped>

</style>
