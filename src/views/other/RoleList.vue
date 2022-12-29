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
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
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

    <s-table ref="table" rowKey="id" size="default" :columns="columns" :data="loadData">
        <template #expandedRowRender="{record}" style="margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
          <a-row>
            <a-col :span="4">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :span="20" v-if="role.actionEntitySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-row>
          </a-col>
        </a-row>
      </template>
      <template #bodyCell="{column, text, record}">
        <template v-if="column.dataIndex === 'status'">
          <a-tag color="blue">{{ statusFilter(text) }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          <span>{{ timeStampFilter(text) }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
        <a @click="$refs.modal.edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
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
    <role-modal ref="modal" @ok="handleOk"></role-modal>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, computed } from "vue";
import dayjs from "dayjs";
import { STable } from "@/components";
import RoleModal from "./modules/RoleModal.vue";
import { getRoleList } from "@/api/manage";

export default defineComponent({
  name: "TableList",
  components: {
    STable,
    RoleModal,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const description =
      "列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。";

    const visible = ref(false);

    const form = null;
    const mdl = ref({});
    // const table = ref(null);

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
        scopedSlots: { customRender: "action" },
      },
    ];
    const STATUS = {
      1: "启用",
      2: "禁用",
    };
    const timeStampFilter = computed(() => (key) => dayjs(key).format("YYYY-MM-DD HH:mm:ss"));
    const statusFilter = computed(() => (key) => STATUS[key]);

    // 加载数据方法 必须为 Promise 对象
    const loadData = (parameter) => {
      return getRoleList({
        params: Object.assign(parameter, queryParam),
      })
        .then((res) => {
          return res.data;
        });
    };
    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);
    function handleEdit(record) {
      mdl.value = Object.assign({}, record);

      mdl.value.permissions.forEach((permission) => {
        permission.actionsOptions = permission.actionEntitySet.map((action) => {
          return {
            label: action.describe,
            value: action.action,
            defaultCheck: action.defaultCheck,
          };
        });
      });

      console.log(mdl.value);
      visible.value = true;
    }
    function handleOk() {
      // 新增/修改 成功时，重载列表
      proxy.$refs.table.refresh();
    }
    function onChange(rowKeys, rows) {
      selectedRowKeys.value = rowKeys;
      selectedRows.value = rows;
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
    return {
      description,
      visible,
      timeStampFilter,
      statusFilter,
      form,
      mdl,
      advanced,
      queryParam,
      columns,
      loadData,
      selectedRowKeys,
      selectedRows,
      handleEdit,
      handleOk,
      onChange,
      toggleAdvanced,
    };
  }
});
</script>
