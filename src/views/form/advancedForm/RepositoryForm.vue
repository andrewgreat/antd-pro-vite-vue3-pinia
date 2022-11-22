<template>
  <a-form @submit="handleSubmit" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="仓库名"  v-bind="validateInfos.name">
          <a-input
            placeholder="请输入仓库名称"
            v-model:value="formRef['name']" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="仓库域名" v-bind="validateInfos.url">
          <a-input
            addonBefore="http://"
            addonAfter=".com"
            placeholder="请输入"
            v-model:value="formRef['url']" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="仓库管理员" v-bind="validateInfos.owner">
          <a-select placeholder="请选择管理员"  v-model:value="formRef['owner']">
            <a-select-option value="王同学">王同学</a-select-option>
            <a-select-option value="李同学">李同学</a-select-option>
            <a-select-option value="黄同学">黄同学</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="审批人" v-bind="validateInfos.approver">
          <a-select placeholder="请选择审批员" v-model:value="formRef['approver']">
            <a-select-option value="王晓丽">王晓丽</a-select-option>
            <a-select-option value="李军">李军</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="生效日期" v-bind="validateInfos.dateRange">
          <a-range-picker
            style="width: 100%"
            v-model:value="formRef['dateRange']" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="仓库类型" v-bind="validateInfos.type">
          <a-select
            placeholder="请选择仓库类型"
            v-model:value="formRef['type']">
            <a-select-option value="公开">公开</a-select-option>
            <a-select-option value="私密">私密</a-select-option>
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
  name: 'RepositoryForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const formRef = reactive({
      name:'',
      url: '',
      owner: '',
      approver: '',
      dateRange: '',
      type: ''
    })

    function urlValidate (rule, value) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        return Promise.reject('需要以 user- 开头');
      }
      return Promise.resolve('success');
    }
    const rulesRef = reactive({
      name: [{ required: true, message: '请输入仓库名称', whitespace: true}],
      url: [{ required: true, message: '请输入仓库域名', whitespace: true}, {validator: urlValidate}],
      owner: [{ required: true, message: '请选择管理员'}],
      approver: [{ required: true, message: '请选择审批员'}],
      dateRange: [{ required: true, message: '请选择生效日期'}],
      type: [{ required: true, message: '请选择仓库类型'}]
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
  }
})
</script>

<style scoped>

</style>
