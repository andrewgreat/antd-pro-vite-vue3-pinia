<template>
  <a-list
    size="large"
    rowKey="id"
    :loading="loading"
    itemLayout="vertical"
    :dataSource="data"
  >
    <template #renderItem="{item}">
      <a-list-item :key="item.id" >
        <template #actions>
          <span> <StarOutlined />{{item.star}}</span>
          <span> <LikeOutlined />{{item.like}}</span>
          <span> <MessageOutlined />{{item.message}}</span>
        </template>
        <a-list-item-meta>
          <template #title>
            <a href="https://vue.ant.design/">{{ item.title }}</a>
          </template>
          <template #description>
          <span>
            <a-tag>Ant Design</a-tag>
            <a-tag>设计语言</a-tag>
            <a-tag>蚂蚁金服</a-tag>
          </span>
          </template>
        </a-list-item-meta>
        <article-list-content :description="item.description" :owner="item.owner" :avatar="item.avatar" :href="item.href" :updateAt="item.updatedAt" />
      </a-list-item>
    </template>

    <div slot="footer" v-if="data.length > 0" style="text-align: center; margin-top: 16px;">
      <a-button @click="loadMore" :loading="loadingMore">加载更多</a-button>
    </div>
  </a-list>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted } from 'vue'
import {requestGet} from '@/api/service'
import { ArticleListContent } from '@/components'

export default defineComponent({
  name: 'Article',
  components: {
    ArticleListContent
  },
  setup () {
    const  loading = ref(true)
    const  loadingMore = ref(false)
    const  data = ref([])

    const getList = () => {
      requestGet('/api/list/article').then(res => {
        data.value = res.data
        loading.value = false
      })
    }
    const loadMore = () => {
      loadingMore.value = true
      requestGet('/api/list/article').then(res => {
        data.value = data.value.concat(res.data)
      }).finally(() => {
        loadingMore.value = false
      })
    }

    onMounted (() =>getList())

    return {
      loading,
      loadingMore,
      data,
      loadMore
    }
  }
})
</script>

<style scoped>

</style>
