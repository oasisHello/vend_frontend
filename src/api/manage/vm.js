import request from '@/utils/request'

// 查询Vending Machine Manage列表
export function listVm(query) {
  return request({
    url: '/manage/vm/list',
    method: 'get',
    params: query
  })
}

// 查询Vending Machine Manage详细
export function getVm(id) {
  return request({
    url: '/manage/vm/' + id,
    method: 'get'
  })
}

// 新增Vending Machine Manage
export function addVm(data) {
  return request({
    url: '/manage/vm',
    method: 'post',
    data: data
  })
}

// 修改Vending Machine Manage
export function updateVm(data) {
  return request({
    url: '/manage/vm',
    method: 'put',
    data: data
  })
}

// 删除Vending Machine Manage
export function delVm(id) {
  return request({
    url: '/manage/vm/' + id,
    method: 'delete'
  })
}
