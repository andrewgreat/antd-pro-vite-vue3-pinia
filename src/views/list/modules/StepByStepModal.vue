<template>
  <a-modal
    title="分步对话框"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">
        <a-step title="基本信息" />
        <a-step title="配置规则属性" />
        <a-step title="设定调度周期" />
      </a-steps>
      <a-form :form="form">
        <!-- step1 -->
        <div v-show="currentStep === 0">
          <a-form-item
            label="规则名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.name"
          >
            <a-input v-model:value="formRef.name" />
          </a-form-item>
          <a-form-item
            label="规则描述"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.desc"
          >
            <a-textarea :rows="4" v-model:value="formRef.desc"></a-textarea>
          </a-form-item>
        </div>
        <div v-show="currentStep === 1">
          <a-form-item
            label="监控对象"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.target"
          >
            <a-select v-model:value="formRef.target" style="width: 100%">
              <a-select-option :value="0">表一</a-select-option>
              <a-select-option :value="1">表二</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="规则模板"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.template"
          >
            <a-select v-model:value="formRef.template" style="width: 100%">
              <a-select-option :value="0">规则模板一</a-select-option>
              <a-select-option :value="1">规则模板二</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            label="规则类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.type"
          >
            <a-radio-group v-model:value="formRef.type" style="width: 100%">
              <a-radio :value="0">强</a-radio>
              <a-radio :value="1">弱</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>

        <div v-show="currentStep === 2">
          <a-form-item
            label="开始时间"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.time"
          >
            <a-date-picker v-model:value="formRef.time" style="width: 100%" />
          </a-form-item>
          <a-form-item
            label="调度周期"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-bind="validateInfos.frequency"
          >
            <a-select v-model:value="formRef.frequency" style="width: 100%">
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="week">周</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <!-- step1 end -->
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="backward" v-if="currentStep > 0" :style="{ float: 'left' }" >上一步</a-button>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleNext(currentStep)">{{ currentStep === 2 && '完成' || '下一步' }}</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, nextTick, reactive, ref} from 'vue';
import {Form} from 'ant-design-vue'
import pick from 'lodash.pick'
import dayjs from 'dayjs';

interface Fields {
  name?: string,
  desc?: string,
  target?: number,
  template?: string,
  type?: string
  time?: Date | dayjs.Dayjs,
  frequency?: string
}

const useForm = Form.useForm
export default defineComponent({
  name: 'StepByStepModal',
  setup (props,{emit}) {
    const labelCol = {
      xs: { span: 24 },
      sm: { span: 7 }
    }
      const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 13 }
    }
    const visible = ref(false)
    const confirmLoading =  ref(false)
    const currentStep =  ref(0)
    const mdl = {}

    const formRef = reactive(<Fields>{
      name: '',
      desc: '',
      target: 0,
      template: '',
      type: '',
      time: dayjs(new Date()),
      frequency: 'month'
    })
    const rulesRef = reactive({
      name: [{required: true}],
      desc: [{required: true}],
      target: [{required: true}],
      template: [{required: true}],
      type: [{required: true}],
      time: [{ type: 'object', required: true, message: 'Please select time!' }],
      frequency: [{required: true}]
    })
    const stepForms = [
      ['name', 'desc'],
      ['target', 'template', 'type'],
      ['time', 'frequency']
    ]

    const { validate, validateInfos } = useForm(formRef, rulesRef)

    const edit = (record) => {
      visible.value = true
      // const { form: { setFieldsValue } } = this
      nextTick(() => {
        pick(record, [])
      })
    }
    const handleNext = (step) => {
      const localStep = step + 1
      if (localStep <= 2) {
        // stepForms
        validate(stepForms[ currentStep.value ])
          .then(() => {
              currentStep.value = localStep
            }
          )
        return
      }
      // last step
      confirmLoading.value = true
      validate(stepForms[ currentStep.value ])
        .then((result) => {
          console.log('result:', result)
          setTimeout(() => {
            confirmLoading.value = false
            emit('ok', result)
          }, 1500)
        })
        .catch((errors)=>{
          confirmLoading.value = false
          console.log('errors:', errors)
       })
    }
    const backward  = () => {
      currentStep.value--
    }
    const handleCancel = () => {
      // clear form & currentStep
      visible.value = false
      currentStep.value = 0
    }
    // form: this.$form.createForm(this)
    return {
      labelCol,
      wrapperCol,
      visible,
      confirmLoading,
      currentStep,
      mdl,
      formRef,
      validate,
      validateInfos,
      edit,
      handleNext,
      backward,
      handleCancel
    }
  }
})
</script>
