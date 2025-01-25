import request from "@/utils/request";

// 查询Employee List列表
export function listEmp(query) {
  return request({
    url: "/manage/emp/list",
    method: "get",
    params: query,
  });
}

// 查询Employee List详细
export function getEmp(id) {
  return request({
    url: "/manage/emp/" + id,
    method: "get",
  });
}

// 新增Employee List
export function addEmp(data) {
  return request({
    url: "/manage/emp",
    method: "post",
    data: data,
  });
}

// 修改Employee List
export function updateEmp(data) {
  return request({
    url: "/manage/emp",
    method: "put",
    data: data,
  });
}

// 删除Employee List
export function delEmp(id) {
  return request({
    url: "/manage/emp/" + id,
    method: "delete",
  });
}
// query the operator by machine info
export function listOperatorByInnerCode(innerCode) {
  return request({
    url: "/manage/emp/listOperatorByInnerCode/" + innerCode,
    method: "get",
  });
}
// query the technician by machine info
export function listTechnicianByInnerCode(innerCode) {
  return request({
    url: "/manage/emp/listTechnicianByInnerCode/" + innerCode,
    method: "get",
  });
}
