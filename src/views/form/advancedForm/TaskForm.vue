<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="任务名" v-bind="validateInfos.name2">
          <a-input placeholder="请输入任务名称" v-model:value="formRef['name2']" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="任务描述" v-bind="validateInfos.url2">
          <a-input placeholder="请输入任务描述" v-model:value="formRef['url2']" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="执行人" v-bind="validateInfos.owner2">
          <a-select
            placeholder="请选择执行人"
            v-model:value="formRef['owner2']" >
            <a-select-option value="黄丽丽">黄丽丽</a-select-option>
            <a-select-option value="李大刀">李大刀</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="责任人" v-bind="validateInfos.approver2">
          <a-select
            placeholder="请选择责任人"
            v-model:value="formRef['approver2']">
            <a-select-option value="王伟">王伟</a-select-option>
            <a-select-option value="李红军">李红军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="提醒时间" v-bind="validateInfos.dateRange2">
          <a-time-picker
            style="width: 100%"
            v-model:value="formRef['dateRange2']" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="任务类型" v-bind="validateInfos.type2">
          <a-select
            placeholder="请选择任务类型"
            v-model:value="formRef['type2']"  >
            <a-select-option value="定时执行">定时执行</a-select-option>
            <a-select-option value="周期执行">周期执行</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue'
import {notification} from 'ant-design-vue'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm
export default defineComponent({
  name: 'TaskForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const formRef = reactive({
      name2:'',
      url2: '',
      owner2: '',
      approver2:'',
      dateRange2:'',
      type2: ''
    })
    const rulesRef = reactive({
      name2: [{ required: true, message: '请输入任务名称', whitespace: true}],
      url2: [{ required: true, message: '请输入任务描述', whitespace: true}],
      owner2: [{ required: true, message: '请选择执行人'}],
      approver2: [{ required: true, message: '请选择责任人'}],
      dateRange2: [{ required: true, message: '请选择提醒时间'}],
      type2: [{ required: true, message: '请选择任务类型'}]
    })
    const { validate, validateInfos } = useForm(formRef, rulesRef)

    function handleSubmit (e) {
      e.preventDefault()
      validate()
        .then((result) => {
          notification['error']({
            message: 'Received values of form:',
            description: result
          })
        }).catch(err => {
        console.log('error', err);
      })
    }
    return {
      formRef,
      validate,
      validateInfos,
      handleSubmit,
    }
  },
  methods: {

  }
})
</script>

<style scoped>

</style>
