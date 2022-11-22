<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="(key) => {tabActiveKey.value = key}"
    content="段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态， 提供跨越设计与开发的体验解决方案。"
  >
    <template #extraContent>
      <div style="width: 155px; margin-top: -20px;"><img style="width: 100%" :src="extraImage" /></div>
    </template>
    <a-list
      rowKey="id"
      :grid="{gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
      class="card-list"
    >
      <template #renderItem="{ item }">
        <a-list-item >
          <template v-if="!item || item.id === undefined">
            <a-button class="new-btn" type="dashed">
              <plus-outlined />新增产品
            </a-button>
          </template>
          <template v-else>
            <a-card :hoverable="true">
              <a-card-meta>
                <template #title>
                  <a>{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-avatar class="card-avatar" :src="item.avatar" size="large">
                  </a-avatar>
                </template>
                <template #description>
                  <div class="meta-content" >{{ item.content }}</div>
                </template>
              </a-card-meta>
              <template class="ant-card-actions" #actions>
                <a>操作一</a>
                <a>操作二</a>
              </template>
            </a-card>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </page-header-wrapper>
</template>

<script lang="ts">
import {defineComponent, reactive, ref } from 'vue'
import {message} from 'ant-design-vue'

interface DataType{
  id: number,
  title: string,
  avatar: string,
  content: string
}

export default defineComponent({
  name: 'CardList',
  setup () {
    const tabList = [
      { key: 'tab1', tab: '快速开始' },
      { key: 'tab2', tab: '产品简介' },
      { key: 'tab3', tab: '产品文档' }
    ]
    const tabActiveKey = ref('tab1')
    const extraImage = 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png'
    const dataSource = reactive(<DataType[]>[])
    dataSource.push(<DataType>{})
    for (let i = 0; i < 11; i++) {
      dataSource.push({
        id: i,
        title: 'Alipay',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
      })
    }

    function testFun () {
      message.info('快速开始被点击！')
    }
    return {
      tabList,
      tabActiveKey,
      extraImage,
      dataSource,
      testFun
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/components/index.less";

  .card-list {
    :deep(.ant-card-body:hover) {
      .ant-card-meta-title>a {
        color: @primary-color;
      }
    }

    :deep(.ant-card-meta-title) {
      margin-bottom: 12px;

      &>a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0,0,0,.85);
      }
    }

  :deep(.meta-content) {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      margin-bottom: 1em;
    }
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

</style>
