<template>
  <page-container>
    <router-view />
  </page-container>
</template>

<script lang="ts">

import {defineComponent} from 'vue'

export default defineComponent({
  name: 'PageView'
})
</script>
