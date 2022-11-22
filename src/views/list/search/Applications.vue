<template>
  <div>
    <a-card :bordered="false" class="ant-pro-components-tag-select">
      <a-form :form="form" >
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
                <a-select style="max-width: 200px; width: 100%;" placeholder="不限" v-model:value="formRef.rate">
                  <a-select-option value="good">优秀</a-select-option>
                  <a-select-option value="normal">普通</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>

    <div class="ant-pro-pages-list-applications-filterCardList">
      <a-list
        :loading="loading"
        :data-source="data"
        :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }"
        style="margin-top: 24px;"
      >
        <template #renderItem="{item}">
         <a-list-item >
          <a-card :body-style="{ paddingBottom: 20 }" hoverable>
            <a-card-meta :title="item.title">
              <template #avatar>
                <a-avatar size="small" :src="item.avatar" />
              </template>
            </a-card-meta>
            <template #actions>
              <a-tooltip title="下载">
                <download-outlined />
              </a-tooltip>
              <a-tooltip title="编辑">
                <edit-outlined />
              </a-tooltip>
              <a-tooltip title="分享">
                <share-alt-outlined />
              </a-tooltip>
              <a-dropdown>
                <a class="ant-dropdown-link">
                  <ellipsis-outlined />
                </a>
                <template #overlay>
                  <a-menu >
                    <a-menu-item>
                      <a href="javascript:;">1st menu item</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">2nd menu item</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">3rd menu item</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <div class="">
              <card-info active-user="100" new-user="999"></card-info>
            </div>
          </a-card>
        </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, UnwrapRef, ref, reactive, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {requestGet} from '@/api/service'
import { TagSelect, StandardFormRow, Ellipsis, AvatarList } from '@/components'
import CardInfo from './components/CardInfo.vue'

interface ApplicationType{
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
    StandardFormRow,
    CardInfo
  },
  setup() {
    const data = reactive([])
    const loading = ref(true)
    const formRef: UnwrapRef<ApplicationType> = reactive({
      category:[],
      author:[],
      rate: undefined
    })

    const fromNow = computed(() => (date) => {
      return dayjs(date).fromNow()
    })

    function getList () {
      requestGet('/api/list/article', { params: { count: 8 } }).then(res => {
        console.log('res', res)
        data.push(...data.concat(res.data))
        loading.value = false
      })
    }
    function handleChange (value) {
      console.log(`selected ${value}`)
    }
    onMounted(() => getList())
    return {
      formRef,
      data,
      loading,
      fromNow,
      getList,
      handleChange
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
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }

    :deep(.ant-pro-avatar-list) {
      flex: 0 1 auto;
    }
  }
}
</style>
