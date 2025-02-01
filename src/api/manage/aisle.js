import request from "@/utils/request";

// 查询Aisle Information列表
export function listAisle(query) {
  return request({
    url: "/manage/aisle/list",
    method: "get",
    params: query,
  });
}

// 查询Aisle Information详细
export function getAisle(id) {
  return request({
    url: "/manage/aisle/" + id,
    method: "get",
  });
}

// 新增Aisle Information
export function addAisle(data) {
  return request({
    url: "/manage/aisle",
    method: "post",
    data: data,
  });
}

// 修改Aisle Information
export function updateAisle(data) {
  return request({
    url: "/manage/aisle",
    method: "put",
    data: data,
  });
}

// 删除Aisle Information
export function delAisle(id) {
  return request({
    url: "/manage/aisle/" + id,
    method: "delete",
  });
}

// query aisle by vm inner code
export function listAisleByVmCode(query) {
  return request({
    url: "/manage/aisle/list_by_vmcode/",
    method: "get",
    params:query,
  });
}