import { builder, getBody } from '../util'
import { MockMethod } from 'vite-plugin-mock';

const username = ['admin', 'super']
// 强硬要求 ant.design 相同密码
// '21232f297a57a5a743894a0e4a801fc3',
const password = ['8914de686ab28dc22f30d3d8e107ff6c', '21232f297a57a5a743894a0e4a801fc3'] // admin, ant.design

const login = (options) => {
  const body = getBody(options)
  if (!username.includes(body.username) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '账户或密码错误', 401)
  }
  return builder({
    'id': '@guid',
    'username': 'admin',
    'name': '@name',
    'nickname': '@cname()',
    'email': '@email',
    'password': '',
    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    'status|1': ['0', '1'],
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': '@datetime',
    'creatorId': 'admin',
    'createTime': '@datetime',
    'deleted': 0,
    'roleId': 'admin',
    'remark': '@cword(10,20)',
    'lang': 'zhCN',
    'token': '4291d7da9005377ec9aec4a71ea837f'
  }, '', 200, { 'Custom-Header': '@guid' })
}

const logout = () => {
  return builder({}, '[测试接口] 注销成功')
}

const smsCaptcha = () => {
  return builder({ captcha: '@integer(10000, 99999)' },'')
}

const twofactor = () => {
  return builder({ stepCode: '@integer(0, 1)' },'')
}

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    timeout: 200,
    response: login
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    timeout: 200,
    response: logout,
  },
  {
    url: '/api/account/sms',
    method: 'post',
    timeout: 200,
    response: smsCaptcha,
  },
  {
    url: '/api/auth/2step-code',
    method: 'post',
    timeout: 200,
    response: twofactor,
  }
] as MockMethod[]
