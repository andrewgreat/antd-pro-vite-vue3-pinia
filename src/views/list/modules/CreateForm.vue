<template>
  <a-modal
    title="新建规则"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-model:value="formRef.id" disabled />
        </a-form-item>
        <a-form-item v-bind="validateInfos.description" label="描述">
          <a-input v-model:value="formRef.description" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from 'vue'
import { Form} from 'ant-design-vue'
// import pick from 'lodash.pick'

interface Fields{
  id?: number,
  description?: string
}

const useForm = Form.useForm
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  setup (props) {
    const {model} = props
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    // 表单字段
    const formRef = reactive(<Fields> {
      id: model?.id,
      description: model?.description
    })

    const rulesRef = reactive({
      id: [{required: false}],
      description: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]
    })
    const { validate, validateInfos } = useForm(formRef, rulesRef)

    // console.log('custom modal created')

    // 当 model 发生改变时，为表单设置值
    watch(model, () => {
      formRef.id= model.id
      formRef.description= model.description
      console.log('watch',model)
      // model && pick(model, formRef)
    })

    return {
      formLayout,
      formRef,
      validate,
      validateInfos
    }
  }
})
</script>
