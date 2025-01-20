import request from '@/utils/request'

// 查询Operation detail table列表
export function listOperationDetail(query) {
  return request({
    url: '/manage/operationDetail/list',
    method: 'get',
    params: query
  })
}

// 查询Operation detail table详细
export function getOperationDetail(id) {
  return request({
    url: '/manage/operationDetail/' + id,
    method: 'get'
  })
}

// 新增Operation detail table
export function addOperationDetail(data) {
  return request({
    url: '/manage/operationDetail',
    method: 'post',
    data: data
  })
}

// 修改Operation detail table
export function updateOperationDetail(data) {
  return request({
    url: '/manage/operationDetail',
    method: 'put',
    data: data
  })
}

// 删除Operation detail table
export function delOperationDetail(id) {
  return request({
    url: '/manage/operationDetail/' + id,
    method: 'delete'
  })
}
