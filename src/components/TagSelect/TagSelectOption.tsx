import { defineComponent, ref, watch, inject } from 'vue'
import { Tag } from 'ant-design-vue'

const { CheckableTag } = Tag
export default defineComponent({
  name: 'TagSelectOption',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select-option'
    },
    value: {
      type: [String, Number, Object],
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  setup: function (props, {slots, emit}) {
    const localChecked = ref(props.checked || false)
    const optionValue = ref(props.value)
    const items: any = inject('items')

    watch(() => props.checked, (val) => {
      localChecked.value = val
    })

    watch(items, (val) => {
        // @ts-ignore
        optionValue && val.hasOwnProperty(optionValue.value) && (localChecked.value = val[optionValue.value])
      },
      {deep: true}
    )

    const render = () => {
      const optionChange = (optionChecked: boolean) => {
        // @ts-ignore
        emit('change', {value: optionValue.value, checked: optionChecked})
      }
      const renderSlot = slots.default?.()
      // @ts-ignore
      return (
        <CheckableTag v-model={[localChecked.value, 'checked']} onChange={optionChange}>{renderSlot}</CheckableTag>)
    }
    return () => render()
  }
})
