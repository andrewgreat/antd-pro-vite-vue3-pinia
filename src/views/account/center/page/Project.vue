<template>
  <div class="ant-pro-pages-account-projects-cardList">
    <a-list :loading="loading" :data-source="data" :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }">
      <template #renderItem="{item}">
        <a-list-item>
          <a-card class="ant-pro-pages-account-projects-card" hoverable>
            <template #cover>
              <img :src="item.cover" :alt="item.title" />
            </template>

            <a-card-meta :title="item.title">
              <template #description>
                <ellipsis :length="50">{{ item.description }}</ellipsis>
              </template>
            </a-card-meta>
            <div class="cardItemContent">
              <span>{{ fromNow(item.updatedAt) }}</span>
              <div class="avatarList">
                <avatar-list size="small">
                  <avatar-list-item
                    v-for="(member, i) in item.members"
                    :key="`${item.id}-avatar-${i}`"
                    :src="member.avatar"
                    :tips="member.name"
                  />
                </avatar-list>
              </div>
            </div>
          </a-card>
        </a-list-item>
      </template>

    </a-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import {requestGet} from '@/api/service';
import {
  TagSelect,
  StandardFormRow,
  Ellipsis,
  AvatarList
} from '@/components/index'
const TagSelectOption = TagSelect.Option
const AvatarListItem = AvatarList.Item

export default defineComponent({
  name: 'Project',
  components: {
    AvatarList,
    AvatarListItem,
    Ellipsis,
    TagSelect,
    TagSelectOption,
    StandardFormRow
  },
  setup () {
    const data = ref([])
    const form  = null
    const loading = ref(true)

    const fromNow = computed(() => {
      return (date) => { return dayjs().diff(dayjs(date),'years') }
    })

    const handleChange  = (value) => {
      console.log(`selected ${value}`)
    }
    const getList = () => {
      requestGet('/api/list/article', { params: { count: 8 } }).then(res => {
        data.value = res.data
        loading.value = false
      })
    }
    onMounted(()=>getList())

    return {
      data,
      form,
      loading,
      fromNow,
      handleChange
    }
  }
})
</script>

<style lang="less" scoped>
  .ant-pro-pages-account-projects-cardList {
    margin-top: 24px;

    :deep(.ant-card-meta-title) {
      margin-bottom: 4px;
    }

    :deep(.ant-card-meta-description) {
      height: 44px;
      overflow: hidden;
      line-height: 22px;
    }

    .cardItemContent {
      display: flex;
      height: 20px;
      margin-top: 16px;
      margin-bottom: -4px;
      line-height: 20px;

      > span {
        flex: 1 1;
        color: rgba(0,0,0,.45);
        font-size: 12px;
      }

      :deep(.ant-pro-avatar-list) {
        flex: 0 1 auto;
      }
    }
  }
</style>
