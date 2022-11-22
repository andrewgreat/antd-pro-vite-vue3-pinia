<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="确认转账后，资金将直接打入对方账户，无法退回。"
        style="margin-bottom: 24px;"
      />
      <a-form-item
        label="付款账户"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
      >
        ant-design@alipay.com
      </a-form-item>
      <a-form-item
        label="收款账户"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
      >
        test@example.com
      </a-form-item>
      <a-form-item
        label="收款人姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
      >
        Alex
      </a-form-item>
      <a-form-item
        label="转账金额"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
      >
        ￥ 5,000.00
      </a-form-item>
      <a-divider />
      <a-form-item
        label="支付密码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        class="stepFormText"
      >
        <a-input
          type="password"
          style="width: 80%;"
          v-model:value="formRef['paymentPassword']"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, onBeforeUnmount } from 'vue';
import {Form} from 'ant-design-vue';

const useForm = Form.useForm
export default defineComponent({
  name: 'Step2',
  setup (props, {emit}) {
    const labelCol = { lg: { span: 5 }, sm: { span: 5 } }
    const wrapperCol = { lg: { span: 19 }, sm: { span: 19 } }
    const loading = ref(false)
    const  timer = ref(<NodeJS.Timeout|number>0)

    const formRef = reactive({
      paymentUser: '',
      payType: 'test@example.com',
      name: 'Alex',
      momey: '',
      paymentPassword: '123456'
    })
    const rulesRef = reactive({
      paymentPassword: [{required: true, message: '请输入支付密码'}]
    })
    const { validate, validateInfos } = useForm(formRef, rulesRef)
    function nextStep () {
      loading.value = true
      // 先校验，通过表单校验后，才进入下一步
      validate()
        .then((values) => {
          emit('nextStep')
          console.log('表单 values', values)
          timer.value = setTimeout(function () {
            loading.value= false
            emit('nextStep')
          }, 1500)
        })
        .catch(err => {
          loading.value = false
          console.log('error', err);
        })
    }
    function prevStep () {
      emit('prevStep')
    }

    // @ts-ignore
    onBeforeUnmount(() => clearTimeout(timer.value))

    return {
      labelCol,
      wrapperCol,
      formRef,
      rulesRef,
      loading,
      timer,
      validate,
      validateInfos,
      nextStep,
      prevStep
    }
  }
})
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
