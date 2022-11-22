<template>
  <div>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :model="formRef">
        <standard-form-row title="所属类目" block style="padding-bottom: 11px;">
          <a-form-item>
            <tag-select v-model:value="formRef.category">
              <tag-select-option value="Category1">类目一</tag-select-option>
              <tag-select-option value="Category2">类目二</tag-select-option>
              <tag-select-option value="Category3">类目三</tag-select-option>
              <tag-select-option value="Category4">类目四</tag-select-option>
              <tag-select-option value="Category5">类目五</tag-select-option>
              <tag-select-option value="Category6">类目六</tag-select-option>
              <tag-select-option value="Category7">类目七</tag-select-option>
              <tag-select-option value="Category8">类目八</tag-select-option>
              <tag-select-option value="Category9">类目九</tag-select-option>
              <tag-select-option value="Category10">类目十</tag-select-option>
            </tag-select>
          </a-form-item>
        </standard-form-row>

        <standard-form-row title="其它选项" grid last>
          <a-row>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item :wrapper-col="{ sm: { span: 16 }, xs: { span: 24 } }" label="作者">
                <a-select
                  style="max-width: 200px; width: 100%;"
                  mode="multiple"
                  placeholder="不限"
                  v-model:value="formRef.author"
                  @change="handleChange"
                >
                  <a-select-option value="lisa">王昭君</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item :wrapper-col="{ sm: { span: 16 }, xs: { span: 24 } }" label="好评度">
                <a-select
                  style="max-width: 200px; width: 100%;"
                  placeholder="不限"
                  v-model:value="formRef.rate"
                >
                  <a-select-option value="good">优秀</a-select-option>
                  <a-select-option value="normal">普通</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>

    <div class="ant-pro-pages-list-projects-cardList">
      <a-list :loading="loading" :data-source="data" :grid="{ gutter: 24, column: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }">
        <template #renderItem="{item}">
         <a-list-item>
          <a-card class="ant-pro-pages-list-projects-card" hoverable>
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
                <avatar-list size="small" :max-length="2">
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
  </div>
</template>

<script lang="ts">
import {defineComponent, UnwrapRef, ref, reactive, computed, onMounted} from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { TagSelect, StandardFormRow, Ellipsis, AvatarList } from '@/components'
import {requestGet} from '@/api/service'

interface ProjectType{
  category:string[],
  author: string[],
  rate: string|undefined
}

dayjs.extend(relativeTime)
const TagSelectOption = TagSelect.Option
const AvatarListItem = AvatarList.Item
export default defineComponent({
  components: {
    AvatarList,
    AvatarListItem,
    Ellipsis,
    TagSelect,
    TagSelectOption,
    StandardFormRow
  },
  setup() {
    const data = reactive([])
    const loading = ref(true)
    const formRef: UnwrapRef<ProjectType> = reactive({
      category:[],
      author:[],
      rate: undefined
    })

    function handleChange (value) {
      console.log(`selected ${value}`)
    }
    function getList () {
      requestGet('/api/list/article', { params: { count: 8 } }).then(res => {
        console.log('res', res)
        data.push(...data.concat(res.data))
        loading.value = false
      })
    }
    const fromNow = computed(() => (date) => {
      return dayjs(date).fromNow()
    })
    onMounted(() => getList())

    return {
      formRef,
      data,
      loading,
      handleChange,
      getList,
      fromNow
    }
  }
})
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  :deep(.ant-pro-tag-select) .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
.ant-pro-pages-list-projects-cardList {
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
