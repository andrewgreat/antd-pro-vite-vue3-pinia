<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false" :content="$t('form.basic-form.basic.description')">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form :model="formRef" @submit="handleSubmit">
        <a-form-item
          :label="$t('form.basic-form.title.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-bind="validateInfos.name">
          <a-input
            name="name"
            v-model:value="formRef['name']"
            :placeholder="$t('form.basic-form.title.placeholder')" />
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.date.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-bind="validateInfos.buildTime">
          <a-range-picker
            name="buildTime"
            v-model:value="formRef['buildTime']"
            value-format="YYYY-MM-DD"
            style="width: 100%"/>
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.goal.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-bind="validateInfos.description">
          <a-textarea
            rows="4"
            v-model:value="formRef['description']"
            :placeholder="$t('form.basic-form.goal.placeholder')"/>
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.standard.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-bind="validateInfos.type">
          <a-textarea
            rows="4"
            v-model:value="formRef['type']"
            :placeholder="$t('form.basic-form.standard.placeholder')"/>
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.client.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          v-bind="validateInfos.customer">
          <a-input
            name="customer"
            v-model:value="formRef['customer']"
            :placeholder="$t('form.basic-form.client.placeholder')"/>
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.invites.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input
            v-model:value="formRef['invites']"
            :placeholder="$t('form.basic-form.invites.placeholder')" />
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.weight.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        >
          <a-input-number v-model:value="formRef['weight']" :min="0" :max="100" />
          <span> %</span>
        </a-form-item>
        <a-form-item
          :label="$t('form.basic-form.public.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :help="$t('form.basic-form.label.help')"
        >
          <a-radio-group v-model:value="formRef['target']">
            <a-radio :value="1">{{ $t('form.basic-form.radio.public') }}</a-radio>
            <a-radio :value="2">{{ $t('form.basic-form.radio.partially-public') }}</a-radio>
            <a-radio :value="3">{{ $t('form.basic-form.radio.private') }}</a-radio>
          </a-radio-group>
          <a-form-item v-show="formRef.target === 2">
            <a-select  v-model:value="formRef['option']" mode="multiple">
              <a-select-option value="4">{{ $t('form.basic-form.option.A') }}</a-select-option>
              <a-select-option value="5">{{ $t('form.basic-form.option.B') }}</a-select-option>
              <a-select-option value="6">{{ $t('form.basic-form.option.C') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">{{ $t('form.basic-form.form.submit') }}</a-button>
          <a-button style="margin-left: 8px">{{ $t('form.basic-form.form.save') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="ts">
import {defineComponent, reactive, toRaw, UnwrapRef} from 'vue';
import { useI18n } from 'vue-i18n';
import { Form } from 'ant-design-vue';
import  { Dayjs } from 'dayjs';

interface FormState {
  name: string,
  buildTime: Dayjs[],
  description: string,
  type: string,
  customer: string,
  invites: string,
  weight: number,
  target: number,
  option: string[]
}

const useForm = Form.useForm
export default defineComponent({
  name: 'BaseForm',
  setup () {
    const { t } = useI18n()
    const dateFormat = 'YYYY-MM-DD';
    const formRef: UnwrapRef<FormState> = reactive({
      name: '',
      buildTime: [],
      description: '',
      type: '',
      customer: '',
      invites: '',
      weight: 0,
      target: 1,
      option: []
    })
    const rulesRef = reactive({
      name: [{ required: true, message: t('form.basic-form.title.required') }],
      buildTime: [{ required: true, message: t('form.basic-form.date.required') }],
      description: [{ required: true, message: t('form.basic-form.goal.required') }],
      type: [{ required: true, message: t('form.basic-form.standard.required') }],
      customer: [{ required: true, message: t('form.basic-form.client.required') }]
    })
    const { resetFields, validate, validateInfos } = useForm(formRef, rulesRef)
    // handler
    const handleSubmit = () => {
      validate()
        .then(() => {
          console.log(toRaw(formRef));
        })
        .catch(err => {
          console.log('error', err);
        });
    };

    return {
      dateFormat,
      formRef,
      resetFields,
      validateInfos,
      handleSubmit
    }
  }
})
</script>
