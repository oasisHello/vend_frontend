import request from '@/utils/request'

// 查询Product table列表
export function listGoods(query) {
  return request({
    url: '/manage/goods/list',
    method: 'get',
    params: query
  })
}

// 查询Product table详细
export function getGoods(id) {
  return request({
    url: '/manage/goods/' + id,
    method: 'get'
  })
}

// 新增Product table
export function addGoods(data) {
  return request({
    url: '/manage/goods',
    method: 'post',
    data: data
  })
}

// 修改Product table
export function updateGoods(data) {
  return request({
    url: '/manage/goods',
    method: 'put',
    data: data
  })
}

// 删除Product table
export function delGoods(id) {
  return request({
    url: '/manage/goods/' + id,
    method: 'delete'
  })
}
