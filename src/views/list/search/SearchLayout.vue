<template>
  <page-container
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <template #content>
      <div class="ant-pro-page-header-search">
        <a-input-search size="large" style="width: 80%; max-width: 522px;">
          <template #enterButton>
            搜索
          </template>
        </a-input-search>
      </div>
    </template>
    <router-view />
  </page-container>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'

export default defineComponent({
  name: 'SearchLayout',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const tabList =reactive([
      { key: '1', tab: '文章' },
      { key: '2', tab: '项目' },
      { key: '3', tab: '应用' }
    ])
    const tabActiveKey= ref('2')
    const search = ref(true)
    const getActiveKey = (path) => {
      switch (path) {
        case '/list/search/article':
          return '1'
        case '/list/search/project':
          return '2'
        case '/list/search/application':
          return '3'
        default:
          return '1'
      }
    }
    //created
    tabActiveKey.value = getActiveKey(route.path)
    watch(route, (val) => {
      tabActiveKey.value = getActiveKey(val.path)
    })

    function handleTabChange (key) {
      console.log('handleTabChange...',key)
      tabActiveKey.value = key
      switch (key) {
        case '1':
          router.push('/list/search/article')
          break
        case '2':
          router.push('/list/search/project')
          break
        case '3':
          router.push('/list/search/application')
          break
        default:
          router.push('/workplace')
      }
    }
    return {
      tabList,
      tabActiveKey,
      search,
      getActiveKey,
      handleTabChange
    }
  }
})
</script>

<style lang="less" scoped>
.ant-pro-page-header-search {
  text-align: center;
  margin-bottom: 16px;
}
</style>
