import request from '@/utils/request'

// 查询Vending Machine Types列表
export function listVm_type(query) {
  return request({
    url: '/manage/vm_type/list',
    method: 'get',
    params: query
  })
}

// 查询Vending Machine Types详细
export function getVm_type(id) {
  return request({
    url: '/manage/vm_type/' + id,
    method: 'get'
  })
}

// 新增Vending Machine Types
export function addVm_type(data) {
  return request({
    url: '/manage/vm_type',
    method: 'post',
    data: data
  })
}

// 修改Vending Machine Types
export function updateVm_type(data) {
  return request({
    url: '/manage/vm_type',
    method: 'put',
    data: data
  })
}

// 删除Vending Machine Types
export function delVm_type(id) {
  return request({
    url: '/manage/vm_type/' + id,
    method: 'delete'
  })
}
