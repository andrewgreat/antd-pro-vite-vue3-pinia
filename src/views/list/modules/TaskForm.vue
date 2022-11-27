<template>
  <a-form @submit="handleSubmit" :form="formRef">
    <a-form-item
      label="任务名称"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-bind="validateInfos.title"
    >
      <a-input v-model:value="formRef['title']" />
    </a-form-item>
    <a-form-item
      label="开始时间"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-bind="validateInfos.startAt"
    >
      <a-date-picker
        style="width: 100%"
        valueFormat="YYYY-MM-DD HH:mm"
        v-model:value="formRef['startAt']"
      />
    </a-form-item>
    <a-form-item
      label="任务负责人"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-bind="validateInfos.owner"
    >
      <a-select v-model:value="formRef['owner']">
        <a-select-option :value="0">付晓晓</a-select-option>
        <a-select-option :value="1">周毛毛</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="产品描述"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      v-bind="validateInfos.description"
    >
      <a-textarea v-model:value="formRef['description']"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref, toRaw } from "vue";
import { Form } from "ant-design-vue";
import dayjs from "dayjs";

interface TaskFields {
  title: string;
  startAt: dayjs.Dayjs;
  owner: string;
  description?: string;
}

export default defineComponent({
  name: "TaskForm",
  props: {
    record: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const useForm = Form.useForm;
    const visible = ref<boolean>(false);
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 7 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 13 },
    };
    // 表单字段
    const formRef = reactive(<TaskFields>{
      title: "",
      startAt: dayjs(new Date()),
      owner: "",
      description: "",
    });
    const rulesRef = reactive({
      title: [{ required: true, message: "请输入任务名称" }],
      startAt: [{ required: true, message: "请选择开始时间" }],
      owner: [{ required: true, message: "请选择任务负责人" }],
      description: [{}],
    });
    const { validate, validateInfos } = useForm(formRef, rulesRef);

    onMounted(() => {
      props.record && Object.assign(formRef, props.record);
    });

    const onOk = function () {
      console.log("监听了 modal ok 事件");
      return new Promise((resolve) => {
        resolve(true);
      });
    };
    const onCancel = function () {
      console.log("监听了 modal cancel 事件");
      return new Promise((resolve) => {
        resolve(true);
      });
    };
    const handleSubmit = function () {
      visible.value = true;
      validate()
        .then(() => {
          console.log(toRaw(formRef));
        })
        .catch((err) => {
          console.log("error", err);
        });
    };

    return {
      labelCol,
      wrapperCol,
      formRef,
      validate,
      validateInfos,
      onOk,
      onCancel,
      handleSubmit,
    };
  },
});
</script>
