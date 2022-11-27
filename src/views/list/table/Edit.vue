<template>
  <div>
    <a-form :form="formRef" @submit="handleSubmit">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="规则编号"
        hasFeedback
        validateStatus="success"
        v-bind="validateInfos.no"
      >
        <a-input
          placeholder="规则编号"
          v-model:value="formRef['no']"
          :disabled="true"
        ></a-input>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="服务调用次数"
        hasFeedback
        validateStatus="success"
        v-bind="validateInfos.callNo"
      >
        <a-input-number
          :min="1"
          style="width: 100%"
          v-model:value="formRef['callNo']"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
        hasFeedback
        validateStatus="warning"
        v-bind="validateInfos.status"
      >
        <a-select v-model:value="formRef['status']">
          <a-select-option :value="1">Option 1</a-select-option>
          <a-select-option :value="2">Option 2</a-select-option>
          <a-select-option :value="3">Option 3</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
        hasFeedback
        help="请填写一段描述"
        v-bind="validateInfos.description"
      >
        <a-textarea
          :rows="5"
          placeholder="..."
          v-model:value="formRef['description']"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="更新时间"
        hasFeedback
        validateStatus="error"
        v-bind="validateInfos.updatedAt"
      >
        <a-date-picker
          style="width: 100%"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select Time"
          v-model:value="formRef['updatedAt']"
        />
      </a-form-item>

      <a-form-item v-bind="buttonCol">
        <a-row>
          <a-col span="6">
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-col>
          <a-col span="10">
            <a-button @click="handleGoBack">返回</a-button>
          </a-col>
          <a-col span="8"></a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, toRaw, nextTick } from "vue";
import { Form } from "ant-design-vue";
import dayjs from "dayjs";
import { NumberFormat } from "@/utils/userFormat";

interface TableFields {
  id: string;
  callNo: number;
  status: number | undefined;
  description?: string;
  updatedAt: dayjs.Dayjs | undefined;
}

export default defineComponent({
  name: "TableEdit",
  props: {
    record: {
      type: [Object, String],
      default: "",
    },
  },
  setup(props, { emit }) {
    const useForm = Form.useForm;
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 5 },
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 12 },
    };
    const buttonCol = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12, offset: 5 },
      },
    };

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

    // const id = ref(0);
    // 表单字段
    const formRef = reactive(<TableFields>{
      id: "",
      callNo: 0,
      status: undefined,
      description: "",
      updatedAt: undefined,
    });
    const rulesRef = reactive({
      id: [{ required: true, message: "请输入规则编号" }],
      callNo: [{ required: true }],
      status: [{ required: true, message: "请选择状态" }],
      description: [{ required: true }],
      updatedAt: [{ required: false }],
    });
    const { resetFields, validate, validateInfos } = useForm(formRef, rulesRef);

    const handleGoBack = function () {
      emit("onGoBack");
    };
    const handleSubmit = function () {
      validate()
        .then(() => {
          console.log("Received values of form: ", toRaw(formRef));
        })
        .catch((err) => {
          console.log("error", err);
        });
    };
    const handleGetInfo = function () {};
    const loadEditInfo = function (data) {
      // ajax
      console.log(`将加载规则编号 ${NumberFormat(data.no)} 信息到表单`);
      new Promise((resolve) => {
        setTimeout(resolve, 1000);
      })
        .then(() => {
          formRef.id = data.no;
          formRef.callNo = data.callNo;
          formRef.status = data.status;
          formRef.description = data.description;
          formRef.updatedAt = dayjs(data.updatedAt);
        })
        .catch((err) => {
          console.log("error", err);
        });
    };
    onMounted(() => {
      nextTick(() => {
        loadEditInfo(props.record);
      });
    });

    return {
      labelCol,
      wrapperCol,
      buttonCol,
      statusMap,
      formRef,
      resetFields,
      validate,
      validateInfos,
      handleGoBack,
      handleSubmit,
      handleGetInfo,
      loadEditInfo,
    };
  },
});
</script>
