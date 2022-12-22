import { defineComponent, resolveComponent } from 'vue'
import { Menu, Input } from 'ant-design-vue'
const { Search } = Input

export default defineComponent({
  name: 'Tree',
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, expose }) {
    const localOpenKeys = props.openKeys.slice(0);
    expose({ localOpenKeys });
    function handlePlus(item) {
      emit('add', item)
    };
    function handleTitleClick(...args) {
      emit('titleClick', { args })
    };

    function renderSearch() {
      return (
        <Search
          placeholder="input search text"
          style="width: 100%; margin-bottom: 1rem"
        />
      )
    };
    function renderIcon(icon) {
      if (icon) {
        const vnode = resolveComponent(icon + "Outlined");
        return (<vnode />)
      }
      return null
    };
    function renderMenuItem(item) {
      return (
        <a-menu-item key={item.key}>
          {renderIcon(item.icon)}
          {item.title}
          <a class="btn" style="width: 20px;z-index:1300" onClick={() => handlePlus(item)} ></a>
        </a-menu-item>
      )
    };
    function renderItem(item) {
      return item.children ? renderSubItem(item, item.key) : renderMenuItem(item, item.key)
    };
    function renderItemGroup(item) {
      const childrenItems = item.children.map(o => {
        return renderItem(o, o.key)
      })

      console.log(childrenItems);

      return (
        <a-menu-item-group key={item.key} >
          {{
            default: () => childrenItems,
            title: () => {
              return (
                <>
                  <span>{item.title}</span>
                  <a-dropdown>
                    {{
                      default: () => <a class="btn"><ellipsis-outlined /></a>,
                      overlay: () => {
                        return (<a-menu>
                          <a-menu-item key="1">新增</a-menu-item>
                          <a-menu-item key="2">合并</a-menu-item>
                          <a-menu-item key="3">移除</a-menu-item>
                        </a-menu>)
                      }
                    }}
                  </a-dropdown>
                </>
              )
            }
          }}
        </a-menu-item-group>
      )
    };
    function renderSubItem(item, key) {
      const childrenItems = item.children && item.children.map(o => {
        return renderItem(o, o.key)
      })

      const title = (
        <span v_slot="title">
          {renderIcon(item.icon)}
          <span>{item.title}</span>
        </span>
      )

      if (item.group) {
        return renderItemGroup(item)
      }
      // titleClick={handleTitleClick(item)}
      return (
        <a-sub-menu key={key}>
          {{
            default: childrenItems,
            title: title
          }}
        </a-sub-menu>
      )
    }

    function render() {
      const { dataSource, search } = props

      let localOpenKeys = props.openKeys.slice(0)
      const list = dataSource.map(item => {
        return renderItem(item)
      })

      return (
        <div class="tree-wrapper">
          {search ? renderSearch() : null}
          <Menu mode="inline" class="custom-tree" onClick={item => emit('click', item)} onUpdate:openKeys={val => { localOpenKeys = val }} vModel_openKeys={localOpenKeys}>
            {list}
          </Menu>
        </div>
      )
    }
    return () => render()
  }

})
