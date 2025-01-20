import request from '@/utils/request'

// 查询auto supply列表
export function listAutoSupply(query) {
  return request({
    url: '/manage/autoSupply/list',
    method: 'get',
    params: query
  })
}

// 查询auto supply详细
export function getAutoSupply(id) {
  return request({
    url: '/manage/autoSupply/' + id,
    method: 'get'
  })
}

// 新增auto supply
export function addAutoSupply(data) {
  return request({
    url: '/manage/autoSupply',
    method: 'post',
    data: data
  })
}

// 修改auto supply
export function updateAutoSupply(data) {
  return request({
    url: '/manage/autoSupply',
    method: 'put',
    data: data
  })
}

// 删除auto supply
export function delAutoSupply(id) {
  return request({
    url: '/manage/autoSupply/' + id,
    method: 'delete'
  })
}
