<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号">
                <a-input v-model:value="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model:value="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="调用次数">
                  <a-input-number v-model:value="queryParam.callNo" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model:value="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model:value="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select  placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQueryParam">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <up-outlined v-if="advanced"/>
                  <down-outlined v-else/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" @click="handleAdd"><plus-outlined />新建</a-button>
        <a-dropdown  v-if="rowSelection.selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1"><delete-outlined />删除</a-menu-item>
              <!-- lock | unlock -->
              <a-menu-item key="2"><lock-outlined />锁定</a-menu-item>
            </a-menu>
          </template>
          <a-button style="margin-left: 8px">
            批量操作  <down-outlined />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <template v-slot:suffix="{column, record, index, text}">
          <span v-if="column.title==='#'" >{{ index + 1 }}</span>
          <a-badge v-else-if="column.dataIndex==='status'" :status="statusTypeFilter(text)" :text="statusFilter(text)" />
          <span v-else-if="column.dataIndex==='action'">
            <a @click="handleEdit(record)">配置</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">订阅报警</a>
          </span>
        </template>
      </s-table>

      <create-form v-if="visible"
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="ts">
import {defineComponent, computed, ref, unref, reactive, toRaw} from 'vue';
import {message, Form} from 'ant-design-vue'
import dayjs from 'dayjs'
import { STable } from '@/components/index'
import { getRoleList, getServiceList } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal.vue'
import CreateForm from './modules/CreateForm.vue'

interface QueryParam {
  id?: number,
  status?: number,
  date?: Date | dayjs.Dayjs,
  callNo?: number,
  useStatus?: number
}

const useForm = Form.useForm
export default defineComponent({
  name: 'TableList',
  components: {
    STable,
    CreateForm,
    StepByStepModal
  },
  setup () {
    const table=ref(null)
    const createModal=ref(null)
    const modal=ref(null)
    const columns = [
      {
        title: '#',
        scopedSlots: { customRender: 'serial' }
      },
      {
        title: '规则编号',
        dataIndex: 'no'
      },
      {
        title: '描述',
        dataIndex: 'description',
        ellipsis: true
      },
      {
        title: '服务调用次数',
        dataIndex: 'callNo',
        sorter: true,
        needTotal: true,
        customRender: (text) => text + ' 次'
      },
      {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: '150px',
        scopedSlots: { customRender: 'action' }
      }
    ]

    const statusMap = reactive({
      0: {
        status: 'default',
        text: '关闭'
      },
      1: {
        status: 'processing',
        text: '运行中'
      },
      2: {
        status: 'success',
        text: '已上线'
      },
      3: {
        status: 'error',
        text: '异常'
      }
    })
    const dataSource = reactive({})

    const formRef = reactive(<QueryParam> {
      id: 0,
      status: undefined,
      date:  dayjs(new Date()),
      callNo: undefined,
      useStatus: undefined
    })
    const rulesRef = reactive({
    })
    const { resetFields, validate, validateInfos } = useForm(formRef, rulesRef)

    // create model
    const visible = ref(false)
    const confirmLoading = ref(false)
    const mdl = ref(null)
    // 高级搜索 展开/关闭
    const advanced = ref(false)
    // 查询参数
    const queryParam =  reactive(<QueryParam>{})
    // 加载数据方法 必须为 Promise 对象
    const loadData = parameter => {
      const requestParameters = Object.assign({}, parameter, queryParam)
      // console.log('loadData request parameters:', requestParameters)
      return getServiceList(requestParameters)
        .then(res => {
          return res.data
        }).catch(err =>{
          console.log('error',err)
        })
    }

    const statusFilter = computed(() => (type) => statusMap[type].text)
    const statusTypeFilter = computed(() => (type) => statusMap[type].status)

    const selectedRowKeys = ref([])
    const selectedRows = ref([])

    const onSelectChange = (rowKeys, rows) => {
      selectedRowKeys.value = unref(rowKeys)
      selectedRows.value = toRaw(rows)
    }

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        selectedRows: unref(selectedRows),
        onChange: onSelectChange
      }
    })

    const resetQueryParam = () => {
      queryParam.id=undefined
      queryParam.status=undefined
      queryParam.date=undefined
      queryParam.callNo=undefined
      queryParam.useStatus=undefined
    }

    const handleAdd = () => {
      mdl.value = null
      visible.value = true
    }
    const handleEdit =  (record) => {
      visible.value = true
      mdl.value = { ...record }
    }
    const handleOk = () => {
      confirmLoading.value = true
      // @ts-ignore
      createModal.value.validate()
        .then((result) => {
          console.log('createModal validate',result)
          // @ts-ignore
          if (result.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(result)
              }, 1000)
            }).then(res => {
              visible.value = false
              confirmLoading.value = false
              // 重置表单数据
              resetFields()
              // 刷新表格
              // @ts-ignore
              table.value.refresh()
              message.info('修改成功')
            })
          }else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(0)
              }, 1000)
            }).then(res => {
              visible.value = false
              confirmLoading.value = false
              // 重置表单数据
              resetFields()
              // 刷新表格
              // @ts-ignore
              table.value.refresh()
              message.info('新增成功')
            })
          }
        }).catch(() => {
          confirmLoading.value = false
          // console.log('error', err)
        });
    }

    const handleCancel = () => {
      visible.value = false
      // 清理表单数据（可不做）
      resetQueryParam()
    }
    const handleSub =  (record) => {
      if (record.status !== 0) {
        message.info(`${record.no} 订阅成功`)
      } else {
        message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    }

    const toggleAdvanced =  () => {
      advanced.value = !advanced.value
    }

    //created
    getRoleList({ t: new Date() })

    return {
      table,
      createModal,
      modal,
      columns,
      dataSource,
      formRef,
      resetFields,
      validate,
      validateInfos,
      statusMap,
      visible,
      confirmLoading,
      mdl,
      advanced,
      queryParam,
      loadData,
      statusFilter,
      statusTypeFilter,
      rowSelection,
      onSelectChange,
      resetQueryParam,
      handleAdd,
      handleEdit,
      handleOk,
      handleCancel,
      handleSub,
      toggleAdvanced
    }
  }
})
</script>
