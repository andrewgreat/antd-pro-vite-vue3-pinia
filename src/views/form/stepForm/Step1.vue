<template>
  <div>
    <a-form :model="formRef" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="付款账户"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-bind="validateInfos.paymentUser"
      >
        <a-select
          placeholder="ant-design@alipay.com"
          v-model:value="formRef['paymentUser']"
        >
          <a-select-option value="1">ant-design@alipay.com</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="收款账户"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-bind="validateInfos.payType"
      >
        <a-input-group
          style="display: inline-block; vertical-align: middle"
          :compact="true"
        >
          <a-select defaultValue="alipay" style="width: 100px">
            <a-select-option value="alipay">支付宝</a-select-option>
            <a-select-option value="wexinpay">微信</a-select-option>
          </a-select>
          <a-input
            :style="{width: 'calc(100% - 100px)'}"
            v-model:value="formRef['payType']"
          />
        </a-input-group>
      </a-form-item>
      <a-form-item
        label="收款人姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-bind="validateInfos.name"
      >
        <a-input v-model:value="formRef['name']"/>
      </a-form-item>
      <a-form-item
        label="转账金额"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        v-bind="validateInfos.momey"
      >
        <a-input prefix="￥" v-model:value="formRef['momey']"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>转账到支付宝账户</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
      <h4>转账到银行卡</h4>
      <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive} from 'vue'
import { Form } from 'ant-design-vue';

const useForm = Form.useForm
export default defineComponent({
  name: 'Step1',
  setup (props, {emit}) {
    const labelCol = { lg: { span: 5 }, sm: { span: 5 } }
    const wrapperCol = { lg: { span: 19 }, sm: { span: 19 } }
    const formRef = reactive({
      paymentUser: '',
      payType: 'test@example.com',
      name: 'Alex',
      momey: '5000'
    })
    const rulesRef = reactive({
      paymentUser: [{required: true, message: '付款账户必须填写'}],
      name: [{required: true, message: '收款人名称必须核对'}],
      payType: [{required: true, message: '收款账户必须填写'}],
      momey: [{required: true, message: '转账金额必须填写'}]
    })
    const { validate, validateInfos } = useForm(formRef, rulesRef)
    function nextStep () {
      // 先校验，通过表单校验后，才进入下一步
      validate()
        .then(() => {
          emit('nextStep')
        })
        .catch(err => {
          console.log('error', err);
        })
    }
    return {
      labelCol,
      wrapperCol,
      formRef,
      validate,
      validateInfos,
      nextStep
    }
  }
})
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
