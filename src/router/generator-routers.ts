// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
// import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import BasicLayout from '@/layouts/BasicLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import RouteView from '@/layouts/RouteView.vue'
import PageView from '@/layouts/PageView.vue'
import {CustemRouter} from '@/router/types';

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import('@/views/exception/403.vue'),
  '404': () => import('@/views/exception/404.vue'),
  '500': () => import('@/views/exception/500.vue'),

  // 你需要动态引入的页面组件
  Workplace: () => import('@/views/dashboard/Workplace.vue'),
  Analysis: () => import('@/views/dashboard/Analysis.vue'),

  // form
  BasicForm: () => import('@/views/form/basicForm/index.vue'),
  StepForm: () => import('@/views/form/stepForm/StepForm.vue'),
  AdvanceForm: () => import('@/views/form/advancedForm/AdvancedForm.vue'),

  // list
  TableList: () => import('@/views/list/TableList.vue'),
  StandardList: () => import('@/views/list/BasicList.vue'),
  CardList: () => import('@/views/list/CardList.vue'),
  QueryList: () => import('@/views/list/QueryList.vue'),
  SearchLayout: () => import('@/views/list/search/SearchLayout.vue'),
  SearchArticles: () => import('@/views/list/search/Article.vue'),
  SearchProjects: () => import('@/views/list/search/Projects.vue'),
  SearchApplications: () => import('@/views/list/search/Applications.vue'),
  ProfileBasic: () => import('@/views/profile/basic/index.vue'),
  ProfileAdvanced: () => import('@/views/profile/advanced/Advanced.vue'),

  // result
  ResultSuccess: () => import('@/views/result/Success.vue'),
  ResultFail: () => import('@/views/result/Error.vue'),

  // exception
  Exception403: () => import('@/views/exception/403.vue'),
  Exception404: () => import('@/views/exception/404.vue'),
  Exception500: () => import('@/views/exception/500.vue'),

  // account
  AccountCenter: () => import('@/views/account/center/index.vue'),
  AccountSettings: () => import('@/views/account/settings/Index.vue'),
  BasicSettings: () => import('@/views/account/settings/BasicSetting.vue'),
  SecuritySettings: () => import('@/views/account/settings/Security.vue'),
  CustomSettings: () => import('@/views/account/settings/Custom.vue'),
  BindingSettings: () => import('@/views/account/settings/Binding.vue'),
  NotificationSettings: () => import('@/views/account/settings/Notification.vue'),

  // 'TestWork': () => import('@/views/dashboard/TestWork')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter: CustemRouter = {
  path: "/:pathMatch(.*)*",
  redirect: '/404',
  hidden: true
}

// 根级菜单
const rootRouter: CustemRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/dashboard',
  meta: {
    title: 'menu.home'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = token => {
  return new Promise((resolve, reject) => {
    loginService.getCurrentUserNav(token)
      .then(res => {
        // console.log('generatorDynamicRouter response:', res)
        const { data } = res
        const menuNav = []
        const childrenNav = []
        //后端数据, 根级树数组,  根级 PID
        listToTree(data, childrenNav, 0)
        rootRouter.children = childrenNav
        // @ts-ignore
        menuNav.push(rootRouter)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        // console.log(routers)
        resolve(routers)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent?) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter: CustemRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // @vite-ignore
      component: constantRouterComponents[item.component || item.key] || (() => import(`../views/${item.component}.vue`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
