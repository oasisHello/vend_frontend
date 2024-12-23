import request from '@/utils/request'

// 查询vendor列表
export function listVendor(query) {
  return request({
    url: '/manage/vendor/list',
    method: 'get',
    params: query
  })
}

// 查询vendor详细
export function getVendor(id) {
  return request({
    url: '/manage/vendor/' + id,
    method: 'get'
  })
}

// 新增vendor
export function addVendor(data) {
  return request({
    url: '/manage/vendor',
    method: 'post',
    data: data
  })
}

// 修改vendor
export function updateVendor(data) {
  return request({
    url: '/manage/vendor',
    method: 'put',
    data: data
  })
}

// 删除vendor
export function delVendor(id) {
  return request({
    url: '/manage/vendor/' + id,
    method: 'delete'
  })
}
