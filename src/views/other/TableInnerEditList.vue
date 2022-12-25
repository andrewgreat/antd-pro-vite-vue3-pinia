<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数">
                <a-input-number style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker
                  style="width: 100%"
                  placeholder="请输入更新日期"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              "
            >
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary"><plus-outlined />新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1"><delete-outlined />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><lock-outlined />锁定</a-menu-item>
          </a-menu>
        </template>
        <a-button style="margin-left: 8px">
          批量操作 <down-outlined />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="{ show: true, clear: true }"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <template #bodyCell="{ column, text, record }">
      <template v-if="['no','description','callNo','status','updatedAt'].includes(column.dataIndex)">
        <template v-if="editableData[record.key]">
          <a-input 
            v-model:value="editableData[record.key][column.dataIndex]"
            style="margin: -5px 0"
          />
        </template>
        <template v-else>
          <template v-if="column.dataIndex === 'status'">
          <a-badge
            :status="statusTypeFilter(text)"
            :text="statusFilter(text)"
          />
        </template>
        <template v-else-if="column.dataIndex === 'callNo'">
          <span>{{ text }} 次</span>
        </template>
        <template v-else >
          <span>{{ text }}</span>
        </template>
        </template>
      </template>
        <template v-else-if="column.dataIndex === 'action'">
          <div class="editable-row-operations">
          <span v-if="editableData[record.key]">
            <a @click="() => save(record)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="真的放弃编辑吗?" @confirm="() => cancel(record)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a class="edit" @click="() => edit(record)">修改</a>
            <a-divider type="vertical" />
            <a class="delete" @click="() => del(record)">删除</a>
          </span>
        </div>
        </template>
      </template>
    </s-table>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, UnwrapRef, computed } from "vue";
import { Modal } from "ant-design-vue";
import dayjs from "dayjs";
import { STable } from "@/components";
import { getServiceList } from "@/api/manage";

interface TableFields {
  id: string;
  callNo: number;
  status: number | undefined;
  description?: string;
  updatedAt: dayjs.Dayjs | undefined;
}
export default defineComponent({
  name: "TableList",
  components: {
    STable,
  },
  setup() {
    const confirm = Modal.confirm;
    const editableData: UnwrapRef<Record<string, TableFields>> = reactive({});
    // 高级搜索 展开/关闭
    const advanced = ref(false);
    // 查询参数
    const queryParam = {};
    // 表头
    const columns = [
      {
        title: "规则编号",
        dataIndex: "no",
        width: 90,
      },
      {
        title: "描述",
        dataIndex: "description",
        scopedSlots: { customRender: "description" },
      },
      {
        title: "服务调用次数",
        dataIndex: "callNo",
        width: "150px",
        sorter: true,
        needTotal: true,
        scopedSlots: { customRender: "callNo" },
        // customRender: ({text}) => text + ' 次'
      },
      {
        title: "状态",
        dataIndex: "status",
        width: "100px",
        needTotal: true,
        scopedSlots: { customRender: "status" },
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        width: "200px",
        sorter: true,
        scopedSlots: { customRender: "updatedAt" },
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "120px",
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
    // 加载数据方法 必须为 Promise 对象
    const loadData = (parameter) => {
      return getServiceList(Object.assign(parameter, queryParam)).then(
        (res) => {
          return res.data;
        }
      );
    };

    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);

    function handleChange(value, key, column, record) {
      console.log(value, key, column);
      record[column.dataIndex] = value;
    }
    function edit(row) {
      editableData[row.key] = row;
      // row = Object.assign({}, row)
    }
    // eslint-disable-next-line
    function del(row) {
      confirm({
        title: "警告",
        content: `真的要删除 ${row.no} 吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
    function save(row) {
      Object.assign(row, editableData[row.key]);
      delete editableData[row.key];
    }
    function cancel(row) {
      delete editableData[row.key];
    }

    function onSelectChange(rowKeys, rows) {
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
    // };

    return {
      editableData,
      advanced,
      columns,
      statusFilter,
      statusTypeFilter,
      loadData,
      selectedRowKeys,
      selectedRows,
      handleChange,
      edit,
      del,
      save,
      cancel,
      onSelectChange,
      toggleAdvanced,
    };
  },
});
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
