<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table rowKey="id" size="default" :columns="columns" :data="loadData" :expandedRowKeys="expandedRowKeys"
      @expand="handleExpand">
      <template #expandedRowRender="{ record }" style=" margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index"
            :style="{ marginBottom: '12px', height: '23px' }">
            <a-row>
              <a-col :lg="4" :md="24">
                <span>{{ role.permissionName }}：</span>
              </a-col>
              <a-col :lg="20" :md="24" v-if="role.actionList && role.actionList.length > 0">
                <a-tag color="cyan" v-for="action in role.actionList" :key="action">{{ permissionFilter(action)
                }}</a-tag>
              </a-col>
              <a-col :span="20" v-else>-</a-col>
            </a-row>
          </a-col>
        </a-row>
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag color="blue">{{ statusFilter(text) }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          <span>{{ timeStampFilter(text) }}</span>
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:;">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">禁用</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

      </template>
    </s-table>

    <a-modal title="操作" style="top: 20px" :width="800" v-model:visible="visible" @ok="handleOk">
      <a-form class="permission-form" :form="formState">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="唯一识别码" hasFeedback validateStatus="success">
          <a-input placeholder="唯一识别码" disabled="disabled" v-model:value="formState['id']" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称" hasFeedback validateStatus="success">
          <a-input placeholder="起一个名字" v-model:value="formState['name']" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback validateStatus="warning">
          <a-select v-model:value="formState['status']">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述" hasFeedback>
          <a-textarea :rows="5" placeholder="..." id="describe" v-model:value="formState['describe']" />
        </a-form-item>

        <a-divider>拥有权限</a-divider>
        <template v-for="permission in formState.permissions" :key="permission.permissionId">
          <a-form-item class="permission-group" v-if="permission.actionEntitySet && permission.actionEntitySet.length > 0"
            :labelCol="labelCol" :wrapperCol="wrapperCol" 
            :label="permission.permissionName">
            <a-checkbox>全选</a-checkbox>
            <a-checkbox-group v-model:value="permission.actionList">
              <template v-for="actionEntity in permission.actionEntitySet">
                <a-checkbox v-model:value="actionEntity.action">{{ actionEntity.describe }}</a-checkbox>
              </template>
            </a-checkbox-group>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, nextTick } from "vue";
import { Form } from "ant-design-vue";
import dayjs from "dayjs";
import { STable } from "@/components";
import { getRoleList, getServiceList } from "@/api/manage";
import { PERMISSION_ENUM } from "@/core/authorize";

interface FormState {
  id?: string,
  name?: string,
  status?: number,
  describe?: string,
  permissions?: {
    permissionId: string,
    permissionName: string,
    roleId?: string,
    actionEntitySet?: {
      action?: string,
      describe?: string,
      defaultCheck?: false
    }[],
    actionList?: string[],
  }[],
}

const STATUS = {
  1: "启用",
  2: "禁用",
};

const columns = [
  {
    title: "唯一识别码",
    dataIndex: "id",
  },
  {
    title: "角色名称",
    dataIndex: "name",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    sorter: true,

  },
  {
    title: "操作",
    width: "150px",
    dataIndex: "action",
  },
];
export default defineComponent({
  name: "TableList",
  components: {
    STable
  },
  setup() {
    const useForm = Form.useForm;
    const description = "列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。";
    const visible = ref(false);
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 5 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 16 },
    };
    // const form = this.$form.createForm(this);
    const formState = reactive<FormState>({
      id: undefined,
      name: undefined,
      status: 1,
      describe: undefined,
      permissions: [],
    });

    const rulesRef = reactive({
      id: [{required: true, message: '必须有唯一识别码"' }],
      name: [{required: false}],
      status: [{required: false}],
      describe: [{required: false}],
      permissions: [{required: false}],
    })

    const { validate, validateInfos } = useForm(formState, rulesRef)

    const permissions = ref([]);
    // 高级搜索 展开/关闭
    const advanced = ref(false);
    // 查询参数
    const queryParam = {};
    // 表头
    // const  columns;
    const expandedRowKeys = ref<string[]>([]);
    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);
    // 加载数据方法 必须为 Promise 对象
    const loadData = (parameter) => {
      return getRoleList(parameter).then((res) => {
        // 展开全部行
        //@ts-ignore
        expandedRowKeys.value.push.apply(expandedRowKeys.value, res.data.data.map((item) => item.id));
        return res.data;
      });
    };

    const statusFilter = computed(() => (key) => STATUS[key]);
    const permissionFilter = computed(() => (key) => {
      const permission = PERMISSION_ENUM[key]
      return permission && permission.label
    });
    const timeStampFilter = computed(() => (key) => dayjs(key).format("YYYY-MM-DD HH:mm:ss"));

    function created() {
      getServiceList({}).then(res => {
        console.log('getServiceList.call()', res)
      })

      getRoleList({}).then(res => {
        console.log('getRoleList.call()', res)
      })
    }

    function handleEdit(record) {
      visible.value = true

      nextTick(() => {
        // Object.assign(formState,{
        //   id:record.id,
        //   status:record.status,
        //   describe:record.describe,
        //   name:record.describe,
        //   permissions:[
        //     {}
        //   ]
        // });
        Object.assign(formState, record)
      })
    }
    function handleOk(e) {
      e.preventDefault()
      validate()
        .then(() => {
          console.log("success ", validateInfos);
        })
        .catch(err => {
          console.log('error', err);
        });
      // visible.value = false;
    }
    function onChange(rowKeys, rows) {
      selectedRowKeys.value = rowKeys
      selectedRows.value = rows
    }
    function handleExpand(expanded, record) {
      console.log('expanded', expanded, record.id)
      if (expanded) {
        expandedRowKeys.value.push(record.id)
      } else {
        const idx = expandedRowKeys.value.findIndex(item => record.id === item)
        if (idx > -1)
          expandedRowKeys.value.splice(idx, 1)
      }
    }
    function toggleAdvanced() {
      advanced.value = !advanced.value
    }

    // created()

    return {
      description,
      visible,
      labelCol,
      wrapperCol,
      formState,
      permissions,
      advanced,
      queryParam,
      columns,
      loadData,
      expandedRowKeys,
      selectedRowKeys,
      selectedRows,
      statusFilter,
      permissionFilter,
      timeStampFilter,
      handleEdit,
      handleOk,
      onChange,
      handleExpand,
      toggleAdvanced,
    }
  }
});
</script>
<style lang="less" scoped>
.permission-form {
  :deep(.permission-group) {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
