<template>
  <div>
    <h2>本页面内容均为测试功能，暂不提供稳定性保证</h2>
    <a-divider />
    <div class="multi-tab-test">
      <h4>多标签组件测试功能</h4>
      <a-button @click="handleCloseCurrentTab" style="margin-right: 16px"
        >关闭当前页</a-button
      >
      <a-button @click="handleOpenTab" style="margin-right: 16px"
        >打开 任务列表</a-button
      >
      <a-popconfirm
        :visible="visible"
        @confirm="confirm"
        @cancel="cancel"
        okText="确定"
        cancelText="取消"
      >
        <template v-slot:title>
          <div>
            <a-form ref="formRef" :model="formState" layout="inline">
              <a-form-item
                label="自定义名称"
                name="tabName"
                :rules="[{ required: true, message: '请输入新的 Tab 名称' }]"
              >
                <a-input v-model:value="formState.tabName" />
              </a-form-item>
            </a-form>
          </div>
        </template>
        <a-button @click="() => (visible = !visible)" style="margin-right: 16px"
          >修改当前 Tab 名称</a-button
        >
      </a-popconfirm>

      <a-popconfirm
        :visible="visible2"
        @confirm="confirm2"
        @cancel="() => (visible2 = false)"
        okText="确定"
        cancelText="取消"
      >
        <template v-slot:title>
          <div>
            <p>页面 KEY 是由页面的路由 <code>path</code> 决定的</p>
            <p>如果要修改某一个页面标题，该页面必须已经被打开在 Tab 栏</p>
            <p>后期可以考虑优化到编程式 Tab 栏，就可以没有这种限制</p>
            <a-form ref="form2Ref" :model="form2State" layout="inline">
              <a-form-item name="tabKey" label="页面KEY">
                <a-input v-model:value="form2State.tabKey" />
              </a-form-item>
              <a-form-item
                name="tabName"
                label="自定义名称"
                :rules="[{ required: true, message: '请输入新的 Tab 名称' }]"
              >
                <a-input v-model:value="form2State.tabName" />
              </a-form-item>
            </a-form>
          </div>
        </template>
        <a-button @click="() => (visible2 = !visible2)"
          >修改某一个 Tab 名称</a-button
        >
      </a-popconfirm>
    </div>
    <a-divider />
    <div class="page-loading-test">
      <h4>全局遮罩测试</h4>
      <a-button @click="handleOpenLoading" style="margin-right: 16px"
        >打开遮罩(5s 自动关闭)</a-button
      >
      <a-button @click="handleOpenLoadingCustomTip"
        >打开遮罩(自定义提示语)</a-button
      >
    </div>
  </div>
  <a-divider />
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-menu mode="inline">
          <a-sub-menu key="dev">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>Navigation home</template>
            <a-menu-item-group>
              <template #title>
                <a class="btn">ItemGroup home<ellipsis-outlined /></a>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1">新增</a-menu-item>
                      <a-menu-item key="2">合并</a-menu-item>
                      <a-menu-item key="3">移除</a-menu-item>
                    </a-menu>
                  </template>
                  <a class="ant-dropdown-link"><DownOutlined /></a>
                </a-dropdown>
              </template>
              <a-menu-item key="setting:1">Option 1</a-menu-item>
              <a-menu-item key="setting:2">Option 2</a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-sub-menu key="sub1">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>Navigation One</template>
            <a-menu-item-group key="g1">
              <template #icon>
                <QqOutlined />
              </template>
              <template #title>Item 1</template>
              <a-menu-item key="1">Option 1</a-menu-item>
              <a-menu-item key="2">Option 2</a-menu-item>
            </a-menu-item-group>
            <a-menu-item-group key="g2" title="Item 2">
              <a-menu-item key="3">Option 3</a-menu-item>
              <a-menu-item key="4">Option 4</a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #icon>
              <AppstoreOutlined />
            </template>
            <template #title>Navigation Two</template>
            <a-menu-item key="5">Option 5</a-menu-item>
            <a-menu-item key="6">Option 6</a-menu-item>
            <a-sub-menu key="sub3" title="Submenu">
              <a-menu-item key="7">Option 7</a-menu-item>
              <a-menu-item key="8">Option 8</a-menu-item>
            </a-sub-menu>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <template #icon>
              <SettingOutlined />
            </template>
            <template #title>Navigation Three</template>
            <a-menu-item key="9">Option 9</a-menu-item>
            <a-menu-item key="10">Option 10</a-menu-item>
            <a-menu-item key="11">Option 11</a-menu-item>
            <a-menu-item key="12">Option 12</a-menu-item>
          </a-sub-menu>
        </a-menu>
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
          }"
        >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'name'">
            <span>
              <smile-outlined />
              Name
            </span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag
                v-for="tag in record.tags"
                :key="tag"
                :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
              >
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a>Invite 一 {{ record.name }}</a>
              <a-divider type="vertical" />
              <a>Delete</a>
              <a-divider type="vertical" />
              <a class="ant-dropdown-link">
                More actions
                <down-outlined />
              </a>
            </span>
          </template>
        </template>
        </s-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  ref,
  reactive,
  UnwrapRef,
  nextTick,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import type { FormInstance } from "ant-design-vue";
import { STable } from "@/components";
interface FormState {
  tabName: string | undefined;
  tabKey?: string | undefined;
}
export default defineComponent({
  name: "TestWork",
  components: { STable },
  setup() {
    const instance = getCurrentInstance();
    const proxy = instance?.proxy;
    const route = useRoute();

    const visible = ref(false);
    const visible2 = ref(false);

    const formRef = ref<FormInstance>();
    const formState: UnwrapRef<FormState> = reactive({
      tabName: undefined,
      tabKey: undefined,
    });
    // watch(
    //   () => formState.tabName,
    //   () => {
    //     formRef.value.validateFields(["tabName"]);
    //   },
    //   { flush: "post" }
    // );

    const form2Ref = ref<FormInstance>();
    const form2State: UnwrapRef<FormState> = reactive({
      tabName: "",
      tabKey: "/dashboard/workplace",
    });

    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);
    const columns = [
      {
        name: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
      },
      {
        title: "Action",
        key: "action",
      },
    ];

    const data = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "4",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "5",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "6",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "7",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "8",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "9",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "10",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "11",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
      {
        key: "12",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
    ];

    // watch(
    //   () => form2State.tabName,
    //   () => {
    //     form2Ref.value.validateFields(["tabName"]);
    //   },
    //   { flush: "post" }
    // );

    function handleCloseCurrentTab() {
      //@ts-ignore
      proxy?.$multiTab.closeCurrentPage(); // or this.$multiTab.close()
    }
    function handleOpenTab() {
      //@ts-ignore
      proxy?.$multiTab.open("/dashboard/analysis");
    }

    function handleOpenLoading() {
      nextTick(function () {
        console.log("this", this);
        console.log("this.$refs.tInput", proxy?.$refs.tInput);
      });
      //@ts-ignore
      proxy?.$loading.show();
      setTimeout(() => {
        //@ts-ignore
        proxy?.$loading.hide();
      }, 5000);
    }
    function handleOpenLoadingCustomTip() {
      //@ts-ignore
      proxy?.$loading.show({ tip: "自定义提示语" });
      setTimeout(() => {
        //@ts-ignore
        proxy?.$loading.hide();
      }, 5000);
    }

    // confirm
    function confirm(e) {
      e.stopPropagation();
      const { path } = route;
      formRef.value?.validateFields().then((values) => {
        //@ts-ignore
        proxy?.$multiTab.rename(path, values.tabName);
        visible.value = false;
      });
    }
    function cancel() {
      visible.value = false;
    }
    function confirm2(e) {
      e.stopPropagation();
      form2Ref.value?.validateFields().then((values) => {
        //@ts-ignore
        proxy?.$multiTab.rename(values.tabKey, values.tabName);
        visible2.value = false;
      });
    }
    // 加载数据方法 必须为 Promise 对象，模拟http请求
    const loadData = (parameter) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (data)
            resolve({
              pageSize: 10,
              pageNo: 1,
              totalCount: 12,
              totalPage: 2,
              data: data,
            });
          else reject("error: no data!");
        }, 1000);
      })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log("error", err);
        })
    };
    return {
      visible,
      visible2,
      formRef,
      formState,
      form2Ref,
      form2State,
      selectedRowKeys,
      selectedRows,
      handleCloseCurrentTab,
      handleOpenTab,
      handleOpenLoading,
      handleOpenLoadingCustomTip,
      confirm,
      cancel,
      confirm2,
      columns,
      loadData,
    };
  },
});
</script>

<style lang="less" scoped></style>
