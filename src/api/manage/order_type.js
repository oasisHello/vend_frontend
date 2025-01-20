import request from '@/utils/request'

// 查询Order type table列表
export function listOrder_type(query) {
  return request({
    url: '/manage/order_type/list',
    method: 'get',
    params: query
  })
}

// 查询Order type table详细
export function getOrder_type(id) {
  return request({
    url: '/manage/order_type/' + id,
    method: 'get'
  })
}

// 新增Order type table
export function addOrder_type(data) {
  return request({
    url: '/manage/order_type',
    method: 'post',
    data: data
  })
}

// 修改Order type table
export function updateOrder_type(data) {
  return request({
    url: '/manage/order_type',
    method: 'put',
    data: data
  })
}

// 删除Order type table
export function delOrder_type(id) {
  return request({
    url: '/manage/order_type/' + id,
    method: 'delete'
  })
}
