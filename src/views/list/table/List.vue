<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="[16, 16]">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input v-model:value="queryParam.id" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择"
                default-value="0"
              >
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数">
                <a-input-number
                v-model:value="queryParam.callNo"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker
                v-model:value="queryParam.date"
                  style="width: 100%"
                  placeholder="请输入更新日期"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select
                v-model:value="queryParam.useStatus"
                  placeholder="请选择"
                  default-value="0"
                >
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
              <a-button type="primary" @click="table?.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetQueryParam">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <br />
    <div class="table-operator">
      <a-button type="primary" @click="handleAdd"><plus-outlined />新建</a-button>
      <a-button type="dashed" @click="tableOption"
        >{{ (optionAlertShow && "关闭") || "开启" }} alert</a-button
      >
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
    <br />
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <template v-slot:suffix="{ column, record, index, text }">
        <span v-if="column.title === '#'">{{ index + 1 }}</span>
        <a-badge
          v-else-if="column.dataIndex === 'status'"
          :status="statusTypeFilter(text)"
          :text="statusFilter(text)"
        />
        <span v-else-if="column.dataIndex === 'action'">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多<down-outlined /></a>
            <template #overlay>
              <a-menu>
                <a-menu-item><a href="javascript:;">详情</a></a-menu-item>
                <a-menu-item><a href="javascript:;">禁用</a></a-menu-item>
                <a-menu-item><a href="javascript:;">删除</a></a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </span>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import dayjs from "dayjs";
import { STable } from "@/components/index";
import { getRoleList, getServiceList } from "@/api/manage";

interface QueryParam {
  id?: number;
  status?: number;
  date?: dayjs.Dayjs;
  callNo?: number;
  useStatus?: number;
}
export default defineComponent({
  name: "TableList",
  components: {
    STable,
  },
  setup(props, { emit }) {
    const table = ref(null);
    const mdl = reactive({});
    // 高级搜索 展开/关闭
    const advanced = ref(false);

    // 查询参数
    const queryParam = reactive(<QueryParam>{
      id: 0,
      status: undefined,
      date: dayjs(new Date()),
      callNo: undefined,
      useStatus: undefined,
    });
 
    // 表头
    const columns = [
      {
        title: "#",
        scopedSlots: { customRender: "serial" },
      },
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

    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);

    const optionAlertShow = ref<boolean>(false);

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

    const resetQueryParam = () => {
      queryParam.id=undefined
      queryParam.status=undefined
      queryParam.date=undefined
      queryParam.callNo=undefined
      queryParam.useStatus=undefined
    };

    const onSelectChange = function (rowKeys, rows) {
      selectedRowKeys.value = rowKeys;
      selectedRows.value = rows;
    };
    const toggleAdvanced = function () {
      advanced.value = !advanced.value;
    };

    const options = reactive({
      alert: {
        show: true,
        clear: () => {
          selectedRowKeys.value = [];
        },
      },
      rowSelection: {
        selectedRowKeys: selectedRowKeys.value,
        onChange: onSelectChange,
      },
    });

    const tableOption = function () {
      if (!optionAlertShow.value) {
        Object.assign(options, {
          alert: "",
          clear: null,
        });
        optionAlertShow.value = true;
      } else {
        Object.assign(options, {
          alert: false,
          rowSelection: null,
        });
        optionAlertShow.value = false;
      }
    };

    const handleAdd = function () {
      emit("onEdit", {});
    };
    const handleEdit = function (record) {
      emit("onEdit", record);
    };
    const handleOk = function () {};

    const resetSearchForm = function () {
      Object.assign(queryParam, {
        date: dayjs(new Date()),
      });
    };

    tableOption();
    getRoleList({ t: new Date() });

    return {
      table,
      mdl,
      advanced,
      queryParam,
      columns,
      loadData,
      selectedRowKeys,
      selectedRows,
      options,
      optionAlertShow,
      statusTypeFilter,
      statusFilter,
      tableOption,
      resetQueryParam,
      handleAdd,
      handleEdit,
      handleOk,
      onSelectChange,
      toggleAdvanced,
      resetSearchForm,
    };
  },
});
</script>
