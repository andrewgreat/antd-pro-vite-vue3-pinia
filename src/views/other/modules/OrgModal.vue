<template>
  <a-modal
    title="操作"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form ref="formRef" :model="formState">
        <a-form-item label="父级ID" name="parentId" :rules="[{}]">
          <a-input v-model:value="formState.parentId" disabled />
        </a-form-item>
        <a-form-item label="机构名称" name="orgName" :rules="[{}]">
          <a-input v-model:value="formState.orgName" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick, UnwrapRef } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";

interface FormState {
  parentId: string | undefined;
  orgName?: string | undefined;
}
export default defineComponent({
  name: "OrgModal",
  setup(props, { emit }) {
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 5 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 16 },
    };

    const formRef = ref<FormInstance>();
    const formState: UnwrapRef<FormState> = reactive({
      parentId: undefined,
      orgName: undefined,
    });

    const visible = ref(false);
    const confirmLoading = ref(false);
    const mdl = ref({});

    function add(id) {
      edit({ parentId: id });
    }
    function edit(record) {
      mdl.value = Object.assign({}, record);
      visible.value = true;
      nextTick(() => {
        Object.assign(formState, record);
      });
    }
    function close() {
      emit("close");
      visible.value = false;
    }
    function handleOk() {
      // 触发表单验证
      formRef.value?.validateFields().then((values) => {
        //@ts-ignore
        console.log("form values", values);
        confirmLoading.value = true;
        // 模拟后端请求 2000 毫秒延迟
        new Promise((resolve) => {
          setTimeout(() => resolve(0), 2000);
        })
          .then(() => {
            // Do something
            message.success("保存成功");
            emit("ok");
          })
          .catch(() => {
            // Do something
          })
          .finally(() => {
            confirmLoading.value = false;
            close();
          });
      });
    }
    function handleCancel() {
      close();
    }

    return {
      formRef,
      formState,
      labelCol,
      wrapperCol,
      visible,
      confirmLoading,
      mdl,
      add,
      close,
      handleOk,
      handleCancel,
    };
  },
});
</script>
