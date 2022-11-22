import request from '@/utils/request';
//包装get方法
export const requestGet = (url: string, parameter?: Object) => {
  return request({
    url: url,
    method: 'get',
    ...parameter
  })
}

export const requestPost = (url: string, data?: any, config?: Object) => {
  return request({
    url: url,
    method: 'post',
    data: data,

    ...config
  })
}
