<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >

  </a-list>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue';

export default defineComponent({
  name: 'NotificationSettings',
  setup(){
    const data = reactive([])
    return{
      data
    }
  }
})
</script>

<style scoped>

</style>
