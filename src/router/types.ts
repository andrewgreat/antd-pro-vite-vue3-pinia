import { defineComponent } from 'vue';

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

// meta 参数
/**
 * @param {string} title 标题
 * @param {string} locale i18n 配置的属性，在language文件夹
 * @param {string} icon 图标
 * @param {string} url 外链
 * @param {string} iframeUrl 内嵌网页
 * @param {string} iframeData 内嵌网页attr
 * @param {boolean} breadcrumb 是否不展示在 “面包屑”组件上展示
 * @param {number} sort 动态添加排序
 */
export interface RouterMeta {
  title: string
  keepAlive?: boolean
  icon?: any
  permission?: Array<string>
  target?: string
  hidden?: boolean
  hiddenHeaderContent?: boolean
  hideHeader?: boolean
  blank?: boolean
  authority?: []
}

export interface CustemRouter  {
  path: string
  key?: '',
  isMenu?: boolean
  component?: Component | Function
  name?: string
  redirect?: string
  meta?: RouterMeta
  hideChildrenInMenu?: boolean
  children?: CustemRouter[] | undefined
  hidden?: boolean
  // 动态添加
  sort?: number
}
