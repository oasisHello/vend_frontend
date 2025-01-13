import request from '@/utils/request'

// 查询Policy Information列表
export function listPolicy(query) {
  return request({
    url: '/manage/policy/list',
    method: 'get',
    params: query
  })
}

// 查询Policy Information详细
export function getPolicy(id) {
  return request({
    url: '/manage/policy/' + id,
    method: 'get'
  })
}

// 新增Policy Information
export function addPolicy(data) {
  return request({
    url: '/manage/policy',
    method: 'post',
    data: data
  })
}

// 修改Policy Information
export function updatePolicy(data) {
  return request({
    url: '/manage/policy',
    method: 'put',
    data: data
  })
}

// 删除Policy Information
export function delPolicy(id) {
  return request({
    url: '/manage/policy/' + id,
    method: 'delete'
  })
}
