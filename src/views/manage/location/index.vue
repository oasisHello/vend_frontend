<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="name" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入name" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="region" prop="regionId">
        <el-select v-model="queryParams.regionId" placeholder="请选择region" clearable>
          <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['manage:location:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['manage:location:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['manage:location:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['manage:location:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="locationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="seq" type="index" width="70" align="center" prop="id" />
      <el-table-column label="name" align="center" prop="name" />

      <el-table-column label="area type" align="center" prop="businessArea">
        <template #default="scope">
          <dict-tag :options="business_type" :value="scope.row.businessArea" />
        </template>
      </el-table-column>
      <el-table-column label="region" prop="region.name" />
      <el-table-column label="vendor" prop="vendor.name" />
      <el-table-column label="address" align="left" prop="address" show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="getLocationInfo(scope.row)"
            v-hasPermi="['manage:vm:list']">Info</el-button>
          <el-button link type="primary" @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:location:edit']">修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)"
            v-hasPermi="['manage:location:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改location对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="locationRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" placeholder="请输入name" />
        </el-form-item>
        <el-form-item label="area type"  prop="businessArea">
          <el-select v-model="form.businessArea" placeholder="请选择area_type">
            <el-option v-for="dict in business_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="region">
          <el-select v-model="form.regionId" placeholder="请选择region">
            <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="vendor" prop="vendorId">
          <el-select v-model="form.vendorId" placeholder="请选择vendor">
            <el-option v-for="item in vendorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="address" prop="address">
          <el-input v-model="form.address" placeholder="请输入address" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="Location Info" v-model="openLocationInfo" width="500px" append-to-body>
      <el-table :data="vmList" >
        <el-table-column label="Seq" type="index" width="55" align="center" />
        <el-table-column label="Inner Code" align="center" prop="innerCode" />
        <el-table-column label="status" align="center" prop="vmStatus" >
          <template #default="scope">
            <dict-tag :options="vm_status" :value="scope.row.vmStatus" />
          </template>
        </el-table-column>
        <el-table-column label="last supply" align="center" prop="lastSupplyTime" show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastSupplyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>

        </el-table-column>
      
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup name="Location">
import {
  listLocation,
  getLocation,
  delLocation,
  addLocation,
  updateLocation,
} from "@/api/manage/location";
import { listRegion } from "@/api/manage/region"; // @ is equal to src
import { listVendor } from "@/api/manage/vendor";
import { listVm } from "@/api/manage/vm";
import { loadAllParams } from "@/api/page";

const loadAllParamsLocation = reactive({
  ...loadAllParams,
  locationId: null,
});


const { proxy } = getCurrentInstance();
const { business_type } = proxy.useDict("business_type");
const { vm_status } = proxy.useDict("vm_status");

const locationList = ref([]);
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
    name: null,
    regionId: null,
    vendorId: null,
  },
  rules: {
    name: [{ required: true, message: "name不能为空", trigger: "blur" }],
    address: [{ required: true, message: "address不能为空", trigger: "blur" }],
    businessArea: [
      { required: true, message: "area_type不能为空", trigger: "change" },
    ],
    regionId: [
      { required: true, message: "region_id不能为空", trigger: "blur" },
    ],
    vendorId: [
      { required: true, message: "vendor_id不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);
/** 查询location列表 */
function getList() {
  loading.value = true;
  listLocation(queryParams.value).then((response) => {
    locationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** region query */
const regionList = ref([]);
function getRegionList() {
  listRegion(loadAllParams).then((response) => {
    regionList.value = response.rows;
  });
}

/** vendor query*/
const vendorList = ref([]);
function getvendorList() {
  listVendor(loadAllParams).then((response) => {
    vendorList.value = response.rows;
  });

}
/** vending machine list */
const vmList = ref([]);
const openLocationInfo = ref(false);
/**
 *  Using async to Ensure data was loaded before render
 * @param row 
 */
async function getLocationInfo(row) {
  loadAllParams.locationId = row.id;
  listVm(loadAllParams).then((response) => {
    vmList.value = response.rows;
    openLocationInfo.value = true;
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
    name: null,
    address: null,
    businessArea: null,
    regionId: null,
    vendorId: null,
    createdTime: null,
    modifiedTime: null,
    remark: null,
    createdBy: null,
    modifiedBy: null,
  };
  proxy.resetForm("locationRef");
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
  title.value = "添加location";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getLocation(_id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改location";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["locationRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != null) {
        updateLocation(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLocation(form.value).then((response) => {
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
    .confirm('是否确认删除location编号为"' + _ids + '"的数据项？')
    .then(function () {
      return delLocation(_ids);
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
    "manage/location/export",
    {
      ...queryParams.value,
    },
    `location_${new Date().getTime()}.xlsx`
  );
}

getList();
getRegionList(); // preload region list
getvendorList(); // preload vendor list
</script>