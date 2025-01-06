import request from '@/utils/request'

// 查询Role List列表
export function listRole(query) {
  return request({
    url: '/manage/role/list',
    method: 'get',
    params: query
  })
}

// 查询Role List详细
export function getRole(roleId) {
  return request({
    url: '/manage/role/' + roleId,
    method: 'get'
  })
}

// 新增Role List
export function addRole(data) {
  return request({
    url: '/manage/role',
    method: 'post',
    data: data
  })
}

// 修改Role List
export function updateRole(data) {
  return request({
    url: '/manage/role',
    method: 'put',
    data: data
  })
}

// 删除Role List
export function delRole(roleId) {
  return request({
    url: '/manage/role/' + roleId,
    method: 'delete'
  })
}
