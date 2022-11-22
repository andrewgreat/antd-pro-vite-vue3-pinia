import {defineComponent, provide, reactive, ref} from 'vue';
// import PropTypes from 'ant-design-vue/es/_util/vue-types'
import Option from './TagSelectOption'
// import { filterEmpty } from '@/utils/userFormat'

const tagSelect = defineComponent({
  name: 'TagSelect',
  components:{
    Option
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-tag-select'
    },
    // @ts-ignore
    defaultValue: {
      type: Array,
      default: null,
    },
    // @ts-ignore
    value: {
      type: Array,
      default: null
    },
    expandable: {
      type: Boolean,
      default: false
    },
    hideCheckAll: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { slots, emit }) {
    // Option
    const hideCheckAll = props.hideCheckAll
    // const expand = ref(false)
    const localCheckAll = ref(false)

    const getItemsKey = (items) => {
      const totalItem = {}
     items && items.forEach(item => {
        totalItem[item.props && item.props.value] = false
      })
      return totalItem
    }

    const items = reactive(getItemsKey(slots.default?.()))
    // const val = ref(props.value || props.defaultValue || [])
    provide('items', items)
    const optionChange = (checked) => {
      if (typeof checked === 'object') {
        const key = Object.keys(items).filter(key => key === checked.value)
        // @ts-ignore
        items[key] = checked && checked.checked
        const bool = Object.values(items).lastIndexOf(false)
        localCheckAll.value = bool === -1
      }
    }
    const checkAll = (checked) => {
        Object.keys(items).forEach(v => {
          items[v] = checked.checked
        })
        localCheckAll.value = checked.checked
    }

    // CheckAll Button
    const renderCheckAll = () => {
      const renderProps = {
        value: 'total',
        onChange: (checked) => {
          if (typeof checked === 'object'){
            checkAll(checked)
            checked.value = 'total'
            emit('change', checked)
          }
        }
      }
      // @ts-ignore
      const checkAllElement = <Option key={'total'} v-model={[localCheckAll.value, 'checked']} {...renderProps}>All</Option>
      return !hideCheckAll && checkAllElement || null
    }
    // expandable
    // const renderExpandable = () => {
    //
    // }
    // render option
    const renderTags = (its) => {
      const renderProps = {
        value:'',
          onChange: (checked) => {
            if (typeof checked === 'object') {
              optionChange(checked)
              emit('change', checked)
            }
        }
      }
      return  its.map(vnode => {
        const options = vnode.children
        const nodeKey = vnode.props.value
        renderProps.value = nodeKey

      // @ts-ignore
        return <Option key={nodeKey}
                              v-model={[items[nodeKey], 'checked']}
                              {...renderProps}>{options[0].children}</Option>
      })
    }

    const render = () => {
        const { prefixCls }  = props
        const classString = {
          [`${prefixCls}`]: true
        }
      const tagItems = slots.default?.()
         return (
          <div class={classString}>
            {renderCheckAll()}
            {renderTags(tagItems)}
          </div>
        )
      }

    return () => render()
  }
})

export default tagSelect
