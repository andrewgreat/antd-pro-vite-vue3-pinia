<script lang="tsx">
import {defineComponent} from 'vue';
import { cutStrByFullLength, getStrFullLength } from '@/utils/userFormat'

/*
    const isSupportLineClamp = document.body.style.webkitLineClamp !== undefined;

    const TooltipOverlayStyle = {
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
    };
  */

export default defineComponent({
  name: 'Ellipsis',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-ellipsis'
    },
    tooltip: {
      type: Boolean
    },
    length: {
      type: Number,
      required: true
    },
    lines: {
      type: Number,
      default: 1
    },
    fullWidthRecognition: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }){
    const getStrDom = (str, fullLength) => {
      const { length } = props
      return (
        <span>{ cutStrByFullLength(str, length) + (fullLength > length ? '...' : '') }</span>
      )
    }
    const getTooltip =(fullStr, fullLength) =>{
      return (
        <a-tooltip title={fullStr}>
          { getStrDom(fullStr, fullLength) }
        </a-tooltip>
      )
    }

    const render = () => {
      const { tooltip, length } = props
      const str = slots.default?.().map(vNode => vNode.children).join('')
      const fullLength = getStrFullLength(str)
      const strDom = tooltip && fullLength > length ? getTooltip(str, fullLength) : getStrDom(str, fullLength)
      return (
        strDom
      )
    }

    return () => render()
  }
})
</script>
