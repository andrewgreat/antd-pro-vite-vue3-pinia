import {defineComponent, getCurrentInstance, onBeforeMount} from 'vue';
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { warning } from 'ant-design-vue/lib/vc-util/warning'

export default defineComponent({
  name: 'Item',
  props: {
    tips: PropTypes.string,
    src: PropTypes.string.def('')
  },
  setup(props){
    const parent = getCurrentInstance()?.parent
    const { tips, src } = props

    const render = () => {
      const _size = parent?.props.size === 'mini' ? 'small' : parent?.props.size
      const AvatarDom = <a-avatar size={_size || 'small'} src={src} />
      // @ts-ignore
      return (tips && <a-tooltip title={tips}>{AvatarDom}</a-tooltip>) || <AvatarDom />
    }

    onBeforeMount(() =>{
      // @ts-ignore
      warning(parent?.type.__ANT_AVATAR_LIST, 'AvatarListItem must be a subcomponent of AvatarList')
    })

    return () =>  render()
  }
})

