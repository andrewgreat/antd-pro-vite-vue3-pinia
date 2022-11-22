<template>
  <a-result status="403" title="403" sub-title="Sorry, you are not authorized to access this page.">
    <template #extra>
      <a-button type="primary" @click="toHome">Back Home</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'
import { Result, Button } from 'ant-design-vue';

export default defineComponent({
  name: 'Forbidden',
  components:{
     'a-result': Result,
     'a-button': Button
  },
  setup() {
    const router = useRouter()||[ {path:''}]
    const toHome = () => {
      router.push({ path: "/" });
    };
    return {
      toHome
    };
  }
})
</script>
<style lang="less">
@import "ant-design-vue/es/style/themes/default.less";
</style>
