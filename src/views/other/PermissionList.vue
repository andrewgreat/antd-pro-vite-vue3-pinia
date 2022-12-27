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
    <s-table :columns="columns" :data="loadData">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'actions'"  >
        <a-tag color="cyan" v-for="(action, index) in record.actionList" :key="index">{{
          action.describe}}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <span>{{ statusFilter(text) }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <DownOutlined /></a>
            <template #overlay>
              <a-menu>
                <a-menu-item><a href="javascript:;">详情</a></a-menu-item>
                <a-menu-item><a href="javascript:;">禁用</a></a-menu-item>
                <a-menu-item><a href="javascript:;">删除</a></a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </s-table>
    <a-modal title="操作" :width="800" v-model:visible="visible" @ok="handleOk" >
      <a-form :form="mdl">
        <a-form-item :labelCol="labelCol"  :wrapperCol="wrapperCol" label="唯一识别码" hasFeedback validateStatus="success" >
          <a-input  placeholder="唯一识别码" v-model:value="mdl.id" id="no" disabled="disabled" />
        </a-form-item>
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限名称"  hasFeedback validateStatus="success" >
          <a-input placeholder="起一个名字" v-model:value="mdl.name" id="permission_name" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback  validateStatus="warning">
          <a-select v-model:value="mdl.status">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"  label="描述" hasFeedback >
          <a-textarea
            :rows="5"
            v-model:value="mdl.describe"
            placeholder="..."
            id="describe"
          />
        </a-form-item>
        <a-divider />
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赋予权限" hasFeedback >
          <a-select style="width: 100%" mode="multiple" v-model:value="mdl.actions" :allowClear="true" >
            <a-select-option
              v-for="(action, index) in permissionList"
              :key="index"
              :value="action.value"
              >{{ action.label }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from "vue";
import { STable } from "@/components";
import { getPermissions } from "@/api/manage";
interface FormState {
  id?: string,
  name?: string,
  status?: number,
  describe?: string,
  actions?: string[],
}
export default defineComponent({
  name: "TableList",
  components: {
    STable,
  },
  setup() {
    const description =
      "列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。";

    const visible = ref(false);
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 5 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 16 },
    };
    const form = null;
    const mdl = reactive<FormState>({});

    // 高级搜索 展开/关闭
    const advanced = ref(false);
    // 查询参数
    const queryParam = {};
    // 表头
    const columns = [
      {
        title: "唯一识别码",
        dataIndex: "id",
      },
      {
        title: "权限名称",
        dataIndex: "name",
      },
      {
        title: "可操作权限",
        dataIndex: "actions",
        scopedSlots: { customRender: "actions" },
      },
      {
        title: "状态",
        dataIndex: "status",
        scopedSlots: { customRender: "status" },
      },
      {
        title: "操作",
        width: "150px",
        dataIndex: "action",
        scopedSlots: { customRender: "action" },
      },
    ];
    // 向后端拉取可以用的操作列表
    const permissionList = ref([]);
    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);

    // 加载数据方法 必须为 Promise 对象
    const loadData = (parameter) => {
      return getPermissions({
        params: Object.assign(parameter, queryParam),
      }).then((res) => {
        const result = res;
        result.data.map((permission) => {
          permission.actionList = JSON.parse(permission.actionData);
          return permission;
        });
        return result;
      });
    };
    
    const statusFilter = computed(() => (key) => {
      const statusMap = {
        1: "正常",
        2: "禁用",
      };
     return statusMap[key];
    });

    function loadPermissionList() {
      // permissionList
      new Promise(function (resolve, reject) {
        const data = [
          { label: "新增", value: "add", defaultChecked: false },
          { label: "查询", value: "get", defaultChecked: false },
          { label: "修改", value: "update", defaultChecked: false },
          { label: "编辑", value: "edit", defaultChecked: false },
          { label: "列表", value: "query", defaultChecked: false },
          { label: "删除", value: "delete", defaultChecked: false },
          { label: "导入", value: "import", defaultChecked: false },
          { label: "导出", value: "export", defaultChecked: false },
        ];
        // resolve(data)
        setTimeout(function () {
          if (data) resolve(data);
          else reject("error: no data!");
        }, 1000);
      }).then((res) => {
        permissionList.value = res as [];
      });
    }
    function handleEdit(record) {
       Object.assign(mdl, record);
      console.log(mdl);
      visible.value = true;
    }
    function handleOk() {}
    function onChange(rowKeys, rows) {
      selectedRowKeys.value = rowKeys;
      selectedRows.value = rowKeys;
    }
    function toggleAdvanced() {
      advanced.value = !advanced.value;
    }
    //   watch: {
    //     'selectedRows': function (selectedRows) {
    //       this.needTotalList = this.needTotalList.map(item => {
    //         return {
    //           ...item,
    //           total: selectedRows.reduce( (sum, val) => {
    //             return sum + val[item.dataIndex]
    //           }, 0)
    //         }
    //       })
    //     }
    // }

    //created
    loadPermissionList();
    return {
      description,
      visible,
      labelCol,
      wrapperCol,
      form,
      mdl,
      advanced,
      queryParam,
      columns,
      permissionList,
      loadData,
      selectedRowKeys,
      selectedRows,
      statusFilter,
      handleEdit,
      handleOk,
      onChange,
      toggleAdvanced,
    };
  },
});
</script>
