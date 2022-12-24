<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="orgTree"
          :openKeys="openKeys"
          :search="true"
          @click="handleClick"
          @add="handleAdd"
          @titleClick="handleTitleClick"
        ></s-tree>
      </a-col>
      <a-col :span="19">
        <s-table
          ref="table"
          size="default"
          rowKey="key"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys.value,
            onChange: onSelectChange,
          }"
        >
          <template #bodyCell="{ column, record, index, text }">
            <span v-if="column.title === '#'">{{ index + 1 }}</span>
            <a-badge
              v-else-if="column.dataIndex === 'status'"
              :status="statusTypeFilter(text)"
              :text="statusFilter(text)"
            />
            <span v-else-if="column.dataIndex === 'action'">
              <a v-if="$auth('table.update')" @click="handleEdit(record)"
                >编辑</a
              >
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">更多<down-outlined /></a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item><a href="javascript:;">详情</a></a-menu-item>
                    <a-menu-item v-if="$auth('table.disable')"
                      ><a href="javascript:;">禁用</a></a-menu-item
                    >
                    <a-menu-item v-if="$auth('table.delete')"
                      ><a href="javascript:;">删除</a></a-menu-item
                    >
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
          </template>
        </s-table>
      </a-col>
    </a-row>

    <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { message } from "ant-design-vue";
import STree from "@/components/Tree/Tree";
import { STable } from "@/components";
import OrgModal from "./modules/OrgModal.vue";
import { getOrgTree, getServiceList } from "@/api/manage";

export default defineComponent({
  name: "TreeList",
  components: {
    STable,
    STree,
    OrgModal,
  },
  setup(props,{emit}) {
    const openKeys = ref(["key-01"]);
    // 查询参数
    const queryParam = ref({});
    // 表头
    const columns = [
      {
        title: "规则编号",
        dataIndex: "no",
      },
      {
        title: "描述",
        dataIndex: "description",
        ellipsis: true,
      },
      {
        title: "服务调用次数",
        dataIndex: "callNo",
        sorter: true,
        needTotal: true,
        customRender: (text) => text + " 次",
      },
      {
        title: "状态",
        dataIndex: "status",
        scopedSlots: { customRender: "status" },
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        sorter: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "150px",
        scopedSlots: { customRender: "action" },
      },
    ];
    const statusMap = {
      0: {
        status: "default",
        text: "关闭",
      },
      1: {
        status: "processing",
        text: "运行中",
      },
      2: {
        status: "success",
        text: "已上线",
      },
      3: {
        status: "error",
        text: "异常",
      },
    };
    const statusFilter = computed(() => (type) => statusMap[type].text);
    const statusTypeFilter = computed(() => (type) => statusMap[type].status);
    const table = ref(null);
    const modal = ref(null);
    const orgTree = ref([]);
    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);
    // 加载数据方法 必须为 Promise 对象
    const loadData = (parameter) => {
      // console.log("loadData.parameter", parameter);
      return getServiceList(Object.assign(parameter, queryParam))
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log("error", err);
        });
    };
    function handleClick(e) {
      console.log("handleClick", e);
      queryParam.value = {
        key: e.key,
      };
      table.value?.refresh(true);
    }
    function handleAdd(item) {
      console.log("add button, item", item);
      message.info(`提示：你点了 ${item.key} - ${item.title} `);
      modal.value?.add(item.key);
    }
    function handleEdit(record) {
      //编辑表格
      console.log(record)
      // emit("onEdit", record);
    }
    function handleTitleClick(item) {
      console.log("handleTitleClick", item);
    }
    function titleClick(e) {
      console.log("titleClick", e);
    }
    function handleSaveOk() {}
    function handleSaveClose() {}

    function onSelectChange(rowKeys, rows) {
      selectedRowKeys.value = rowKeys;
      selectedRows.value = rows;
    }

    getOrgTree().then((res) => {
      orgTree.value = res.data;
    });
    return {
      modal,
      openKeys,
      queryParam,
      columns,
      statusMap,
      statusFilter,
      statusTypeFilter,
      orgTree,
      selectedRowKeys,
      selectedRows,
      loadData,
      handleClick,
      handleAdd,
      handleEdit,
      handleTitleClick,
      titleClick,
      handleSaveOk,
      handleSaveClose,
      onSelectChange,
    };
  },
});
</script>

<style lang="less">
.custom-tree {
  :deep(.ant-menu-item-group-title) {
    position: relative;
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  :deep(.ant-menu-item) {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  :deep(.btn) {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
