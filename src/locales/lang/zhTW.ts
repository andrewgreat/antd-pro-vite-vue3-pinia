import antd from 'ant-design-vue/es/locale-provider/zh_TW'

import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import global from './zh-TW/global'

import menu from './zh-TW/menu'
import setting from './zh-TW/setting'
import user from './zh-TW/user'
import dashboard from './zh-TW/dashboard'
import form from './zh-TW/form'
import result from './zh-TW/result'
import account from './zh-TW/account'

dayjs.locale('zh-tw');

const components = {
  antLocale: antd
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': '信息',
  'layouts.usermenu.dialog.content': '您确定要注销吗？',
  'layouts.userLayout.title': 'Ant Design 是西湖区最具影响力的 Web 设计规范',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account
}
