<template>
  <span>
    <icon-font :type="type" />
    {{ text }}
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
})

export default defineComponent({
  name: 'IconText',
  components: {
    IconFont,
  },
  props: {
    'type': {
      type: String,
      required: true
    },
    text: {
      type: [String, Number],
      required: true
    }
  },
  setup(props){
    const {type, text} = props
    return{
      type,
      text
    }
  }
})
</script>
<style scoped>
.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>

