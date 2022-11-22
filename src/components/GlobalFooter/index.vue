<template #footerRender>
  <global-footer
    class="footer custom-render"
    :links="[
          { title: 'Github', href: 'https://github.com/greatsky/antd-pro-vite-vue3' },
          { title: 'Ant Design Vue', href: 'https://next.antdv.com' },
        ]"
    copyright="2021 &copy; Andrew"
  />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default defineComponent({
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
})
</script>
