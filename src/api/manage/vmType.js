import request from "@/utils/request";

// 查询Machine Types列表
export function listVmType(query) {
  return request({
    url: "/manage/vmType/list",
    method: "get",
    params: query,
  });
}

// 查询Machine Types详细
export function getVmType(id) {
  return request({
    url: "/manage/vmType/" + id,
    method: "get",
  });
}

// 新增Machine Types
export function addVmType(data) {
  return request({
    url: "/manage/vmType",
    method: "post",
    data: data,
  });
}

// 修改Machine Types
export function updateVmType(data) {
  return request({
    url: "/manage/vmType",
    method: "put",
    data: data,
  });
}

// 删除Machine Types
export function delVmType(id) {
  return request({
    url: "/manage/vmType/" + id,
    method: "delete",
  });
}
