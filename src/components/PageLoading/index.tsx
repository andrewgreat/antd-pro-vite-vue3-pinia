import { createApp, defineComponent, ref } from "vue";
import { Spin } from 'ant-design-vue'

export const PageLoading = defineComponent({
  name: 'PageLoading',
  components: {
    Spin
  },
  props: {
    tip: {
      type: String,
      default: 'Loading..'
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  setup(props, ctx) {
    function render() {
      const style = {
        textAlign: 'center',
        background: 'rgba(0,0,0,0.6)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100
      }
      const spinStyle = {
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: 'translate(-50%, -50%)'
      }
      return (
        <div style={style}>
          <Spin size={props.size} style={spinStyle} tip={props.tip} />
        </div>)
    }
    return () => render();
  },

});

const version = '0.0.1'
const loading = {}

loading.newInstance = (app, options) => {
  let loadingElement = document.querySelector('body>div[type=loading]')
  if (!loadingElement) {
    loadingElement = document.createElement('div')
    loadingElement.setAttribute('type', 'loading')
    loadingElement.setAttribute('class', 'ant-loading-wrapper')
    document.body.appendChild(loadingElement)
  }

  const cdProps = Object.assign({ visible: false, size: 'large', tip: 'Loading...' }, options)

  const instance = createApp(defineComponent({
    components: {
      PageLoading
    },
    setup(props, { expose }) {
      const visible = ref(cdProps.visible);
      const size = ref(cdProps.large);
      const tip = ref(cdProps.tip);
      expose({ visible, size, tip })
      function render() {
        if (visible.value) {
          return (
            <PageLoading tip={tip.value} size={size.value} />
          )
        }
        return null;
      }
      return () => render()
    }
  })).mount(loadingElement)

  function update(config) {
    const { visible, size, tip } = { ...cdProps, ...config }
    instance['visible'] = visible;
    if (tip) {
      instance['tip'] = tip;
    }
    if (size) {
      instance['size'] = size;
    }
  }
  return {
    instance,
    update
  }
}

const api = {
  // instance: {},
  show: function (options) {
    this.instance.update({ ...options, visible: true })
  },
  hide: function () {
    this.instance.update({ visible: false })
  }
}

const install = function (app, options) {
  if (app.config.globalProperties.$loading) {
    return
  }
  api.instance = loading.newInstance(app, options)
  app.config.globalProperties.$loading = api
}

export default {
  version,
  install
}
