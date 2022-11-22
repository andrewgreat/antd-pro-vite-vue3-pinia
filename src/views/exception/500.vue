<template>
  <a-result  status="500" title="500" sub-title="Sorry, the server is reporting an error."
  >
    <template #extra>
      <a-button type="primary" @click="toHome"> Back Home </a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Result, Button } from "ant-design-vue";

export default defineComponent({
  name: "Exception500",
  components: {
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
});
</script>
<style scoped></style>
