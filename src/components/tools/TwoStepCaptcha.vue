<template>
  <!-- 两步验证 -->
  <a-modal centered v-model="visible" :maskClosable="false">
    <div slot="title" :style="{ textAlign: 'center' }">两步验证</div>
    <template slot="footer">
      <div :style="{ textAlign: 'center' }">
        <a-button key="back" @click="handleCancel">返回</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="stepLoading"
          @click="handleStepOk"
        >
          继续
        </a-button>
      </div>
    </template>

    <a-spin :spinning="stepLoading" :form="formRef">
      <a-form layout="vertical">
        <div class="step-form-wrapper">
          <p style="text-align: center" v-if="!stepLoading">
            请在手机中打开 Google Authenticator 或两步验证 APP<br />输入 6
            位动态码
          </p>
          <p style="text-align: center" v-else>正在验证..<br />请稍后</p>
          <a-form-item
            :style="{ textAlign: 'center' }"
            hasFeedback
            fieldDecoratorId="stepCode"
            v-bind="validateInfos.stepCode"
          >
            <a-input
              :style="{ textAlign: 'center' }"
              @keyup.enter.native="handleStepOk"
              placeholder="000000"
              v-model:value="formRef['stepCode']"
            />
          </a-form-item>
          <p style="text-align: center">
            <a @click="onForgeStepCode">遗失手机?</a>
          </p>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRaw } from "vue";
import { Form } from "ant-design-vue";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const useForm = Form.useForm;
    const stepLoading = ref(false);
    const visible = ref(props.visible);
    const formRef = reactive({
      stepCode: "",
    });
    const rulesRef = reactive({
      stepCode: [
        {
          required: true,
          message: "请输入 6 位动态码!",
          pattern: /^\d{6}$/,
          len: 6,
        },
      ],
    });
    const { validate, validateInfos } = useForm(formRef, rulesRef);

    const handleStepOk = function () {
      stepLoading.value = true;

      validate()
        .then(() => {
          console.log(toRaw(formRef));
          setTimeout(() => {
            stepLoading.value = false;
            emit("success", toRaw(formRef));
          }, 2000);
        })
        .catch((err) => {
          stepLoading.value = false;
          emit("error", { err });
          console.log("error", err);
        });
    };

    const handleCancel = function () {
      visible.value = false;
      emit("cancel");
    };
    const onForgeStepCode = function () {};

    return {
      stepLoading,
      visible,
      formRef,
      validate,
      validateInfos,
      handleStepOk,
      handleCancel,
      onForgeStepCode,
    };
  },
});
</script>
<style lang="less" scoped>
.step-form-wrapper {
  margin: 0 auto;
  width: 80%;
  max-width: 400px;
}
</style>
