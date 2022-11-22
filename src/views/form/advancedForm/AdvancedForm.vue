<template>
  <page-header-wrapper content="高级表单常见于一次性输入和提交大批量数据的场景">
    <a-card class="card" title="仓库管理" :bordered="false">
      <repository-form ref="repository" :showSubmit="false" />
    </a-card>
    <a-card class="card" title="任务管理" :bordered="false">
      <task-form ref="task" :showSubmit="false" />
    </a-card>

    <!-- table -->
    <a-card>
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="memberLoading"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="['name', 'workId', 'department'].includes(column.dataIndex)">
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
            />
          <template v-else>{{ text }}</template>
        </template>
          <template v-else-if="column.dataIndex === 'action'">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <span v-if="record.isNew">
                  <a @click="saveRow(record)">添加</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="saveRow(record)">保存</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定要取消?" @confirm="cancel(record.key)">
                    <a>取消</a>
                  </a-popconfirm>
                </span>
              </span>
              <span v-else>
                <a @click="edit(record.key)">编辑</a>
                 <a-divider type="vertical" />
                <a-popconfirm
                  v-if="data.length"
                  title="确定要删除此行?"
                  @confirm="remove(record.key)"
                >
                <a>删除</a>
              </a-popconfirm>
              </span>
            </div>
          </template>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" @click="newMember">
        <plus-outlined />
        新增成员
      </a-button>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <span class="popover-wrapper">
        <a-popover title="表单校验信息" overlayClassName="antd-pro-pages-forms-style-errorPopover" trigger="click" :getPopupContainer="trigger => trigger.parentNode">
          <template #content>
            <li v-for="item in errors" :key="item.key" @click="scrollToField(item.key)" class="antd-pro-pages-forms-style-errorListItem">

              <div class=""> <plus-outlined />{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <exclamation-circle-outlined />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-divider type="vertical" />
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, UnwrapRef } from 'vue';
import {message, notification} from 'ant-design-vue'
import cloneDeep from 'lodash.clonedeep'
import RepositoryForm from './RepositoryForm.vue'
import TaskForm from './TaskForm.vue'
import FooterToolBar from '@/components/FooterToolbar/index'
import {appBase} from '@/store/app-base'

interface DataItem {
  key: string,
  name: string,
  workId: string,
  department: string,
  editable: boolean,
  isNew?: boolean
}

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}

export default defineComponent({
  name: 'AdvancedForm',
  components: {
    FooterToolBar,
    RepositoryForm,
    TaskForm
  },
  setup () {
    const repository = ref(null)
    const task = ref(null)
    const sideCollapsed = ref(false)
    const {isMobile} =appBase
    const loading = ref(false)
    const memberLoading = ref(false)
    // table
    const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
    const columns = reactive([
      {
        title: '成员姓名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: '工号',
        dataIndex: 'workId',
        key: 'workId',
        width: '20%',
        scopedSlots: { customRender: 'workId' }
      },
      {
        title: '所属部门',
        dataIndex: 'department',
        key: 'department',
        width: '40%',
        scopedSlots: { customRender: 'department' }
      },
      {
        title: '操作',
        dataIndex: 'action',
      }
    ])
    let data = reactive(<DataItem[]>[
      {
        key: '1',
        name: '小明',
        workId: '001',
        editable: false,
        department: '行政部'
      },
      {
        key: '2',
        name: '李莉',
        workId: '002',
        editable: false,
        department: 'IT部'
      },
      {
        key: '3',
        name: '王小帅',
        workId: '003',
        editable: false,
        department: '财务部'
      }
    ])
    const errors = ref([])

    function handleSubmit (e) {
      e.preventDefault()
    }

    function newMember () {
      const length = data.length
      const newData = {
        key: length === 0 ? '1' : (parseInt(data[length - 1].key) + 1).toString(),
        name: '',
        workId: '',
        department: '',
        editable: true,
        isNew: true
      }
      data.push(newData)
      editableData[newData.key] = newData
    }

    const edit = (key: string) => {
      editableData[key] = cloneDeep(data.filter(item => key === item.key)[0])
    }
    const remove = (key: string) => {
      const index = data.findIndex(item => item.key === key)
      if (index > -1) {
        data.splice(index, 1)
      }
    }
    const save = (rkey: string) => {
      Object.assign(data.filter(item => rkey === item.key)[0], editableData[rkey])
      delete editableData[rkey]
    }

    const saveRow = (record) => {
      memberLoading.value = true
      const { key, name, workId, department } = record
      if (!name || !workId || !department) {
        memberLoading.value = false
        message.error('请填写完整成员信息。')
        return
      }
      // 模拟网络请求、卡顿 800ms
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 800)
      }).then(() => {
        const target = data.find(item => item.key === key)
        if (target){
          delete editableData[key]
          target.editable = false
          target.isNew = false
        }
        memberLoading.value = false
      })
    }

    const cancel = (key: string) => {
      delete editableData[key]
    }

    function getRowByKey (key, newData) {
      return (newData || data).find(item => item.key === key)
    }

    function handleChange (value, key, column) {
      const newData = [...data]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        data = newData
      }
    }
    // 最终全页面提交
    function validate () {
      const repositoryForm = new Promise((resolve, reject) => {
        // @ts-ignore
        repository.value.validate()
        .then(result => resolve(result))
        .catch(err => reject(err))
      })
      const taskForm = new Promise((resolve, reject) => {
        // @ts-ignore
        task.value.validate()
          .then(result => resolve(result))
          .catch(err => reject(err))
      })

      // clean this.errors
      errors.value.slice(0)
      Promise.all([repositoryForm, taskForm]).then(values => {
        notification['error']({
          message: 'Received values of form:',
          description: JSON.stringify(values)
        })
      }).catch(() => {
        // @ts-ignore
        const errs = Object.assign({}, repository.value.validateInfos, task.value.validateInfos)
        const tmp = { ...errs }
        console.log(tmp)
        errorList(tmp)
      })
    }
    function errorList (errs) {
      if (!errs || errs.length === 0) {
        return
      }
      // @ts-ignore
      errors.value = Object.keys(errs)
        .filter(key => errs[key])
        .map(key => ({
          key: key,
          message: errs[key].help[0][0],
          fieldLabel: fieldLabels[key]
        }))
    }
    function scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    }

    return {
      repository,
      task,
      editableData,
      sideCollapsed,
      isMobile,
      loading,
      memberLoading,
      columns,
      data,
      errors,
      handleSubmit,
      newMember,
      saveRow,
      edit,
      remove,
      save,
      cancel,
      getRowByKey,
      handleChange,
      validate,
      scrollToField
    }
  }
})
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    :deep(.antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content) {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
          margin-right: 4px;
    }
  }
  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
