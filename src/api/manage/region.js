import request from "@/utils/request";

// 查询region列表
export function listRegion(query) {
  return request({
    url: "/manage/region/list",
    method: "get",
    params: query,
  });
}

// 查询region详细
export function getRegion(id) {
  return request({
    url: "/manage/region/" + id,
    method: "get",
  });
}

// 新增region
export function addRegion(data) {
  return request({
    url: "/manage/region",
    method: "post",
    data: data,
  });
}

// 修改region
export function updateRegion(data) {
  return request({
    url: "/manage/region",
    method: "put",
    data: data,
  });
}

// 删除region
export function delRegion(id) {
  return request({
    url: "/manage/region/" + id,
    method: "delete",
  });
}
