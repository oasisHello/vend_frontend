<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="Inner Code" prop="innerCode">
        <el-input v-model="queryParams.innerCode" placeholder="请输入Inner Code" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vmList" @selection-change="handleSelectionChange">
      <el-table-column label="Num" type="index" width="55" align="center" />
      <el-table-column label="Inner Code" align="center" prop="innerCode" />
      <el-table-column label="Type " align="center" prop="vmTypeId">
        <template #default="scope">
          <div v-for="item in vmTypeList" :key="item.id">
            <span v-if="item.id == scope.row.vmTypeId">{{ item.name }} </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Address" align="center" prop="address" />

      <el-table-column label="Status" align="center" prop="vmStatus">
        <template #default="scope">
          <dict-tag :options="vm_status" :value="scope.row.vmStatus" />
        </template>
      </el-table-column>

      <el-table-column label="Running Status" align="center">
        <template #default="scope">
          <span v-if="scope.row.runningStatus != null">
            {{ JSON.parse(scope.row.runningStatus).status == ture ? 'normal' : 'Abnormal' }}
          </span>
          <span v-else>Abnormal</span>

        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="getVMInfo(scope.row)"
            v-hasPermi="['manage:vm:query']">Details</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- VM Info Dialog -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Vm">
import { listVm, getVm, delVm, addVm, updateVm } from "@/api/manage/vm";
import { listVmType } from "@/api/manage/vmType";
import { listVendor } from "@/api/manage/vendor";
import { listLocation } from "@/api/manage/location";
import { loadAllParams } from "@/api/page";
import { listRegion } from "@/api/manage/region";

const { proxy } = getCurrentInstance();
const { vm_status } = proxy.useDict("vm_status"); // Note :  the values stored in the dictionary are strings, not numbers.

const vmList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    innerCode: null,
    locationId: null,
    lastSupplyTime: null,
    businessArea: null,
    regionId: null,
    vendorId: null,
    vmTypeId: null,
    vmStatus: null,
    runningStatus: null,
    policyId: null,
  },
  rules: {
    locationId: [
      { required: true, message: "Location ID不能为空", trigger: "blur" },
    ],
    vmTypeId: [{ required: true, message: "Type ID不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询Vending Machine Manage列表 */
function getList() {
  loading.value = true;
  listVm(queryParams.value).then((response) => {
    vmList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    innerCode: null,
    aisleMaxCapacity: null,
    locationId: null,
    address: null,
    lastSupplyTime: null,
    businessArea: null,
    regionId: null,
    vendorId: null,
    vmTypeId: null,
    vmStatus: null,
    runningStatus: null,
    longitude: null,
    latitude: null,
    clientId: null,
    policyId: null,
    createTime: null,
    updateTime: null,
  };
  proxy.resetForm("vmRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "Add Vending Machine Manage";
}

// get VM Infomation
function getVMInfo(row) {
  reset();
  const _id = row.id || ids.value;
  getVm(_id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "VM Info";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vmRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateVm(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVm(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除Vending Machine Manage编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delVm(_ids);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "manage/vm/export",
    {
      ...queryParams.value,
    },
    `vm_${new Date().getTime()}.xlsx`
  );
}
/* query vm type list */
const vmTypeList = ref([]);
function getVmTypeList() {
  listVmType(loadAllParams).then((response) => {
    vmTypeList.value = response.rows;
  });
}

/* query vendor list */
const vendorList = ref([]);
function getVendorList() {
  listVendor(loadAllParams).then((response) => {
    vendorList.value = response.rows;
  });
}
/**query loaction list */
const locationList = ref([]);
function getLocationList() {
  listLocation(loadAllParams).then((response) => {
    locationList.value = response.rows;
  });
}

/**query region list */
const regionList = ref([]);
function getRegionList() {
  listRegion(loadAllParams).then((response) => {
    regionList.value = response.rows;
  });
}

// Preload data(Cache)
getRegionList();
getVendorList();
getVmTypeList();
getLocationList();
getList();
</script>
