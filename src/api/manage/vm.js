import request from '@/utils/request'

// 查询Vending Machine Information列表
export function listVm(query) {
  return request({
    url: '/manage/vm/list',
    method: 'get',
    params: query
  })
}

// 查询Vending Machine Information详细
export function getVm(id) {
  return request({
    url: '/manage/vm/' + id,
    method: 'get'
  })
}

// 新增Vending Machine Information
export function addVm(data) {
  return request({
    url: '/manage/vm',
    method: 'post',
    data: data
  })
}

// 修改Vending Machine Information
export function updateVm(data) {
  return request({
    url: '/manage/vm',
    method: 'put',
    data: data
  })
}

// 删除Vending Machine Information
export function delVm(id) {
  return request({
    url: '/manage/vm/' + id,
    method: 'delete'
  })
}
