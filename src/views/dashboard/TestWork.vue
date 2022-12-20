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

interface FormState {
  tabName: string | undefined;
  tabKey?: string | undefined;
}
export default defineComponent({
  name: "TestWork",
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
      formRef.value.validateFields().then((values) => {
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
      form2Ref.value.validateFields().then((values) => {
        //@ts-ignore
        proxy?.$multiTab.rename(values.tabKey, values.tabName);
        visible2.value = false;
      });
    }
    return {
      visible,
      visible2,
      formRef,
      formState,
      form2Ref,
      form2State,
      handleCloseCurrentTab,
      handleOpenTab,
      handleOpenLoading,
      handleOpenLoadingCustomTip,
      confirm,
      cancel,
      confirm2,
    };
  },
});
</script>

<style lang="ts" scoped></style>
