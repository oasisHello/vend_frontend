import request from '@/utils/request'

// 查询Order table列表
export function listOrder(query) {
  return request({
    url: '/manage/order/list',
    method: 'get',
    params: query
  })
}

// 查询Order table详细
export function getOrder(id) {
  return request({
    url: '/manage/order/' + id,
    method: 'get'
  })
}

// 新增Order table
export function addOrder(data) {
  return request({
    url: '/manage/order',
    method: 'post',
    data: data
  })
}

// 修改Order table
export function updateOrder(data) {
  return request({
    url: '/manage/order',
    method: 'put',
    data: data
  })
}

// 删除Order table
export function delOrder(id) {
  return request({
    url: '/manage/order/' + id,
    method: 'delete'
  })
}
