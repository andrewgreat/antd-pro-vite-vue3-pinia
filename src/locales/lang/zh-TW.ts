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
  'layouts.usermenu.dialog.content': '您確定要註銷嗎？',
  'layouts.userLayout.title': 'Ant Design 是西湖區最具影響力的 Web 設計規範',
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
