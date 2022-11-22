// @ts-nocheck
import {defineComponent, reactive, watchEffect, unref} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import {tableProps} from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'

export default defineComponent({

  props: Object.assign({}, tableProps(), {
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      // @ts-ignore
      type: [String,Boolean],
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  }),
  setup (props,{slots, emit, expose }) {
    const router = useRouter()
    const route = useRoute()
    const tableData = {
       needTotalList: [] as Object[],
       selectedRows:  [],
       selectedRowKeys:[],
       localLoading:false,
       localDataSource: [] as Object[],
       localPagination: Object.assign({}, props.pagination) as Object
    }
    const _this = reactive(Object.assign({}, props, tableData))

    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    const loadData = (pagination?, filters?, sorter?) => {
      _this.localLoading = true
      const parameter = Object.assign({
          pageNo: (pagination && pagination.current) ||
            _this.showPagination && _this.localPagination.current || _this.pageNum,
          pageSize: (pagination && pagination.pageSize) ||
            _this.showPagination && _this.localPagination.pageSize || _this.pageSize
        },
        (sorter && sorter.field && {
          sortField: sorter.field
        }) || {},
        (sorter && sorter.order && {
          sortOrder: sorter.order
        }) || {}, {
          ...filters
        }
      )
      // @ts-ignore
      const result = _this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          _this.localPagination = _this.showPagination && Object.assign({}, _this.localPagination, {
            current: r.pageNo, // 返回结果中的当前分页数
            total: r.totalCount, // 返回结果中的总记录数
            showSizeChanger: _this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              _this.localPagination.pageSize
          }) || false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          // @ts-ignore
          if (r.data.length === 0 && _this.showPagination && _this.localPagination.current > 1) {
            // @ts-ignore
            _this.localPagination.current--
            loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if ((['auto', true].includes(_this.showPagination) && r.totalCount <= (r.pageNo * _this.localPagination.pageSize))) {
              // @ts-ignore
              _this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            _this.localPagination = false
          }
          _this.localDataSource = r.data // 返回结果中的数组数据
          _this.localLoading = false
        })
      }
    }

    function initTotalList (columns):Object[] {
      const totalList = [] as Object[]
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    }
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param rowKeys
     * @param rows
     */
    const updateSelect = (rowKeys, rows) => {
      _this.selectedRowKeys = unref(rowKeys)
      _this.selectedRows = unref(rows)
      const list = _this.needTotalList
      _this.needTotalList = list.map(item => {
        return {
          ...item,
          total: _this.selectedRows.reduce((sum, val) => {
            // @ts-ignore
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    }

    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param bool
     */
    // @ts-ignore
    const refresh = (bool=false) => {
      bool && (_this.localPagination = Object.assign({}, {
        current: 1, pageSize: _this.pageSize
      }))
      loadData()
    }
    expose({
      refresh
    })

    /**
     * 清空 table 已选中项
     */
    const clearSelected = () => {
      if (_this.rowSelection) {
        _this.rowSelection.onChange([], [])
        updateSelect([], [])
      }
    }

    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    const renderClear = (callback) => {
      if (_this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          clearSelected()
        }}>清空</a>
      )
    }

    const renderAlert = () => {
      // 绘制统计列数据
      const needTotalItems = _this.needTotalList.map((item) => {
        return (<>
          <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{_this.selectedRows.length}</a></span>
          <span style="margin-right: 12px">
          {item.title}总计 <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
        </span>
        </>)
      })

      // 绘制 清空 按钮
      const clearItem = (typeof _this.alert.clear === 'boolean' && _this.alert.clear) ? (
        renderClear(clearSelected)
      ) : (typeof _this.alert.clear === 'function') ? (
        renderClear(_this.alert.clear)
      ) : null

      // 绘制 alert 组件
      return (
        <a-alert show-icon  message={needTotalItems} style="margin-bottom: 16px">
          {clearItem}
        </a-alert>
      )
    }

    //created
    const { pageNo } = route.params
    // @ts-ignore
    const localPageNum = _this.pageURI && (pageNo && parseInt(pageNo)) || _this.pageNum
    _this.localPagination = ['auto', true].includes(_this.showPagination) && Object.assign({}, _this.localPagination, {
      current: localPageNum,
      pageSize: _this.pageSize,
      showSizeChanger: _this.showSizeChanger
    }) || false
    _this.needTotalList = initTotalList(_this.columns)
    loadData()

    watchEffect(()=>{
      //localPagination.current
      _this.pageURI && router.push({
        ...route,
        // @ts-ignore
        name: route.name,
        params: Object.assign({}, route.params, {
          // @ts-ignore
          pageNo: _this.localPagination.current
        })
      })
      // change pagination, reset total data
      _this.needTotalList = initTotalList(_this.columns)
      _this.selectedRowKeys = []
      _this.selectedRows = []
      //pageNum
      Object.assign(_this, {
        // @ts-ignore
        pageNum: _this.localPagination.current
      })

      //pageSize
      Object.assign(_this.localPagination, {
        pageSize: _this.pageSize
      })
      //showSizeChanger
      Object.assign(_this.localPagination, {
        showSizeChanger: _this.showSizeChanger
      })
    })

    function render () {
      const renderProps = [] as Object[]
      const localKeys = Object.keys(tableData)
      // @ts-ignore
      const showAlert = (typeof _this.alert === 'object' && _this.alert !== null && _this.alert.show) && typeof _this.rowSelection.selectedRowKeys !== 'undefined' || _this.alert
      const tpros=tableProps()
      Object.keys(tpros).forEach(k => {
        const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
        if (localKeys.includes(localKey)) {
          renderProps[k] = _this[localKey]
          return renderProps[k]
        }
        if (k === 'rowSelection') {
          if (showAlert && _this.rowSelection) {
            // 如果需要使用alert，则重新绑定 rowSelection 事件
            renderProps[k] = {
              ..._this.rowSelection,
              selectedRows: _this.selectedRows,
              selectedRowKeys: _this.selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                updateSelect(selectedRowKeys, selectedRows)
                // @ts-ignore
                typeof _this[k].onChange !== 'undefined' && _this[k].onChange(selectedRowKeys, selectedRows)
              }
            }
            return renderProps[k]
          } else if (!_this.rowSelection) {
            // 如果没打算开启 rowSelection 则清空默认的选择项
            renderProps[k] = null
            return renderProps[k]
          }
        }
        _this[k] && (renderProps[k] = _this[k])
        return renderProps[k]
      })

      const renderSlot=(column,record,text,index)=>{
        if (column.scopedSlots?.customRender){
          return slots.suffix && slots.suffix({column: column, record: record, text: text, index: index})
        }
        return column.customRender ? column.customRender(text) : text
      }

       const table = (
        <a-table
          { ...renderProps }
          v-slots={{
            bodyCell: ({column, record, index, text}) =><span>{ renderSlot(column,record,text,index) }</span>
          }}
           onChange={loadData}
           onExpand={ (expanded, record) => { emit('expand', expanded, record) } }
        >

        </a-table>
      )

      return (
        <div class="table-wrapper">
          { showAlert ? renderAlert() : null }
          { table }
        </div>
      )
    }

    return ()=>render()
  }
})
