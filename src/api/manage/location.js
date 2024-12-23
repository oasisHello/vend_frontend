import request from '@/utils/request'

// 查询location列表
export function listLocation(query) {
  return request({
    url: '/manage/location/list',
    method: 'get',
    params: query
  })
}

// 查询location详细
export function getLocation(id) {
  return request({
    url: '/manage/location/' + id,
    method: 'get'
  })
}

// 新增location
export function addLocation(data) {
  return request({
    url: '/manage/location',
    method: 'post',
    data: data
  })
}

// 修改location
export function updateLocation(data) {
  return request({
    url: '/manage/location',
    method: 'put',
    data: data
  })
}

// 删除location
export function delLocation(id) {
  return request({
    url: '/manage/location/' + id,
    method: 'delete'
  })
}
