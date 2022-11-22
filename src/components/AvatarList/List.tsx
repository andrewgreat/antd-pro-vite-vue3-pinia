import { defineComponent } from 'vue';

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import Item from './Item'
import { filterEmpty } from '@/utils/userFormat'
import './index.less'

/**
 * size: `number`、 `large`、`small`、`default` 默认值: default
 * maxLength: number
 * excessItemsStyle: CSSProperties
 */
const AvatarListProps = {
  prefixCls: PropTypes.string.def('ant-pro-avatar-list'),
  size: {
    validator: val => {
      return typeof val === 'number' || ['small', 'large', 'default'].includes(val)
    },
    default: 'default'
  },
  maxLength: PropTypes.number.def(0),
  excessItemsStyle: PropTypes.object.def({
    color: '#f56a00',
    backgroundColor: '#fde3cf'
  })
}

const AvatarList = defineComponent({
  name: 'AvatarList',
  props: AvatarListProps,
  __ANT_AVATAR_LIST: true,
  Item,
  setup(props, { slots }){
    const { prefixCls, size, maxLength, excessItemsStyle } = props

    const getItems = (items) => {
      const className = {
        [`${prefixCls}-item`]: true,
        [`${size}`]: true
      }
      const totalSize = items.length
        if (maxLength > 0) {
          items = items.slice(0, maxLength)
          // console.log(items)
          items.push((<a-avatar size={size === 'mini' ? 'small' : size} style={excessItemsStyle}>{`+${totalSize - maxLength}`}</a-avatar>))
        }
        return items.map((item) => (
          <li class={className}>{item}</li>
        ))
    }

    const render = () => {
      const className = {
        [`${prefixCls}`]: true,
        [`${size}`]: true
      }

      // @ts-ignore
      const items = filterEmpty(slots.default()[0].children)
      const itemsDom = items && items.length ? <ul class={`${prefixCls}-items`}>{getItems(items)}</ul> : null
      return (
        <div class={className}>
          {itemsDom}
        </div>
      )
    }
    return () => render()
  }
})

AvatarList.install = function (Vue) {
  Vue.component(AvatarList.name, AvatarList)
  Vue.component(AvatarList.Item.name, AvatarList.Item)
}

export default AvatarList
