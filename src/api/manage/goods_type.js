import request from '@/utils/request'

// 查询Product type table列表
export function listGoods_type(query) {
  return request({
    url: '/manage/goods_type/list',
    method: 'get',
    params: query
  })
}

// 查询Product type table详细
export function getGoods_type(id) {
  return request({
    url: '/manage/goods_type/' + id,
    method: 'get'
  })
}

// 新增Product type table
export function addGoods_type(data) {
  return request({
    url: '/manage/goods_type',
    method: 'post',
    data: data
  })
}

// 修改Product type table
export function updateGoods_type(data) {
  return request({
    url: '/manage/goods_type',
    method: 'put',
    data: data
  })
}

// 删除Product type table
export function delGoods_type(id) {
  return request({
    url: '/manage/goods_type/' + id,
    method: 'delete'
  })
}
