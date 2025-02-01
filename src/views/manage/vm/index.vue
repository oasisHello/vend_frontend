<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="code" prop="innerCode">
        <el-input v-model="queryParams.innerCode" placeholder="请输入Inner Code" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manage:vm:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['manage:vm:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['manage:vm:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['manage:vm:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Inner Code" align="center" prop="innerCode" />
      <el-table-column label="Type " align="center" prop="vmTypeId">
        <template #default="scope">
          <div v-for="item in vmTypeList" :key="item.id">
            <span v-if="item.id == scope.row.vmTypeId">{{ item.name }} </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Address" align="center" prop="address" />
      <el-table-column label="Vendor" align="center" prop="vendorId">
        <template #default="scope">
          <div v-for="item in vendorList" :key="item.id">
            <span v-if="item.id == scope.row.vendorId">{{ item.name }} </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Status" align="center" prop="vmStatus">
        <template #default="scope">
          <dict-tag :options="vm_status" :value="scope.row.vmStatus" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">

        <template #default="scope">
          <el-button link type="primary" @click="handleAisle(scope.row)"
            v-hasPermi="['manage:vm:edit']">Aisle</el-button>
          <el-button link type="primary" @click="handlePolicy(scope.row)"
            v-hasPermi="['manage:policy:list']">policy</el-button>
          <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['manage:vm:edit']">修改</el-button>
        </template>

      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改Vending Machine Manage对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vmRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="Code" prop="innerCode">
          <span>{{
            form.innerCode == null ? "Auto Generated" : form.innerCode
          }}</span>
        </el-form-item>

        <el-form-item label="Supply Time" v-if="form.innerCode != null">
          <span>{{
            new Date(form.lastSupplyTime)
              .toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
              .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1")
              .replace(",", "")
          }}</span>
        </el-form-item>

        <el-form-item label="Type" v-if="form.innerCode != null">
          <div v-for="item in vmTypeList" :key="item.id">
            <span v-if="item.id == form.vmTypeId">{{ item.name }} </span>
          </div>
        </el-form-item>

        <el-form-item label="Type" prop="vmTypeId" v-if="form.innerCode == null">
          <el-select v-model="form.vmTypeId" placeholder="Select">
            <el-option v-for="item in vmTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="capacity" v-if="form.innerCode != null">
          <span>{{ form.aisleMaxCapacity }}</span>
        </el-form-item>

        <el-form-item label="Location" prop="locationId">
          <el-select v-model="form.locationId" placeholder="Location">
            <el-option v-for="item in locationList" :key="item.id" :label="item.address" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="vendor" v-if="form.innerCode != null">
          <div v-for="item in vendorList" :key="item.id">
            <span v-if="item.id == form.vendorId">{{ item.name }} </span>
          </div>
        </el-form-item>

        <el-form-item label="region" v-if="form.innerCode != null">
          <div v-for="item in regionList" :key="item.id">
            <span v-if="item.id == form.regionId">{{ item.name }} </span>
          </div>
        </el-form-item>

        <el-form-item label="address" v-if="form.innerCode != null">
          <div v-for="item in locationList" :key="item.id">
            <span v-if="item.id == form.locationId">{{ item.address }} </span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- policy dialog  -->
    <el-dialog title="Policy Selection" v-model="openPolicy" width="500px" append-to-body>
      <el-form ref="vmRef" :model="form" label-width="100px">
        <el-form-item label="Policy" prop="policyId">
          <el-select v-model="form.policyId" placeholder="Policy">
            <el-option v-for="item in policyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer" style="margin-right: 10px;">
          <el-button type="primary" @click="submitForm">Confirm</el-button>
          <el-button @click="cancel">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 
    <aisleDialog
      :open="openAisleDialog"
      :data="aisleData"
      @update:open="openAisleDialog = $event"
      @add-product="handleAddProduct"
      @delete-product="handleDeleteProduct"
      @confirm-changes="handleConfirmChanges"
    /> -->

    <!-- el-dialog with dynamic slides and grid layout -->

    <el-dialog v-model="openAisleDialog" title="Item Slider" width="70%" append-to-body>
      <!-- Carousel for sliding items -->
      <el-row style="margin-bottom: 5px;">
        <el-col :span="8">
          Column:
          <div v-for="item in vmTypeList" :key="item.id">
            <span v-if="item.id == imported.vmTypeId"> {{ item.colCount }} </span>
          </div>
        </el-col>
        <el-col :span="8">
          Row:
          <div v-for="item in vmTypeList" :key="item.id">
            <span v-if="item.id == imported.vmTypeId"> {{ item.rowCount }} </span>
          </div>
        </el-col>
        <el-col :span="8">
          Capacity:
          <div v-for="item in vmTypeList" :key="item.id">
            <span v-if="item.id == imported.vmTypeId"> {{ item.aisleMaxCapacity }} </span>
          </div>
        </el-col>
      </el-row>

      <el-carousel :autoplay="false" indicator-position="outside" arrow="always">
        <el-carousel-item v-for="(slide, index) in paginatedItems" :key="index">
          <div class="item-grid">
            <!-- Using the ItemCard Component -->
            <ItemCard v-for="(item, itemIndex) in slide" :key="itemIndex" :item="item" @add-item="handleAddItem"
              @remove-item="handleDeleteItem" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <!-- Edit the goods in aisle. -->
    <el-dialog title="Edit Aisle" v-model="openAddGoods" width="500px" append-to-body>
      <el-form ref="addGoodsRef" :model="aisle" :rules="rules" label-width="150px">
        <el-form-item label="code">
          <span>{{ aisle.code }}</span>
        </el-form-item>
        <el-form-item label="Goods" prop="goodsId">
          <el-select v-model="aisle.goodsId" placeholder="Goods">
            <el-option v-for="item in goodsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="machine inner code">
          <span>{{ aisle.innerCode }}</span>
        </el-form-item>
        <el-form-item label="max capacity">
          <span>{{ aisle.maxCapacity }}</span>
        </el-form-item>
        <el-form-item label="current capacity">
          <span>{{ aisle.currentCapacity }}</span>
        </el-form-item>
        <el-form-item label="last supply time">
          <span>{{ aisle.lastSupplyTime }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitAisleForm">确 定</el-button>
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
import { listPolicy } from "@/api/manage/policy";
import { listAisleByVmCode, updateAisle, addAisle, delAisle } from "@/api/manage/aisle";
import { listGoods } from "@/api/manage/goods";
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
  openPolicy.value = false;// close policy dialog
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
/** handle policy */
const openPolicy = ref(false);
function handlePolicy(row) {
  form.value = row;
  openPolicy.value = true;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value;
  getVm(_id).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "Modify Vending Machine";
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
          openPolicy.value = false;
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

function submitAisleForm() {
  proxy.$refs["addGoodsRef"].validate(valid => {
    if (valid) {
      if (aisle.value.id != null) {
        updateAisle(aisle.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          listAisleByVmCode(imported.value.innerCode).then(response => {
            aisleList.value = response.data;
          })
          openAddGoods.value = false;
        });
      } else {
        addAisle(aisle.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          listAisleByVmCode(imported.value.innerCode).then(response => {
            aisleList.value = response.data;
          })
          openAddGoods.value = false;
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


/**query region list */
const regionList = ref([]);
function getRegionList() {
  listRegion(loadAllParams).then((response) => {
    regionList.value = response.rows;
  });
}
/**query loaction list */
const locationList = ref([]);
function getLocationList() {
  listLocation(loadAllParams).then((response) => {
    locationList.value = response.rows;
  });
}

/** query policy list */
const policyList = ref([]);
function getPolicyList() {
  listPolicy(loadAllParams).then((response) => {
    policyList.value = response.rows;
  });
}

// query goods list
const goodsList = ref([]);
function getGoodsList() {
  listGoods(loadAllParams).then((response) => {
    goodsList.value = response.rows;
  })
}
/************************* Aisle*********************/
// State for the dialog and data
const openAisleDialog = ref(false);
const aisleList = ref({});

// open aisle dialog
function handleAisle(row) {
  imported.value = row;// NOTE: retrieve data of current row.
  listAisleByVmCode(row.innerCode).then(response => {
    aisleList.value = response.data;
  })
  openAisleDialog.value = true;
  console.log(imported);
  console.log(aisleList);
}
//*********************** Aisle 2*********************/
import ItemCard from './ItemCard.vue';
/**
 * Opens the dialog for aisle configuration
 * 
 */
const openDialog = () => {

};
// Example data
const imported = ref([]);

const itemsPerPage = 8;

// Paginate items
const paginatedItems = computed(() => {
  const pages = [];
  for (let i = 0; i < aisleList.value.length; i += itemsPerPage) {
    pages.push(aisleList.value.slice(i, i + itemsPerPage));
  }
  return pages;
});

// Handle button actions
const openAddGoods = ref(false);
const aisle = ref({});
const handleAddItem = (item) => {
  openAddGoods.value = true;
  aisle.value = item;
};

const handleDeleteItem = (item) => {
  aisle.value = item;
  aisle.value.goodsId = 0;
  if (aisle.value.id != null) {
    updateAisle(aisle.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
    });
    listAisleByVmCode(imported.value.innerCode).then(response => {
      aisleList.value = response.data;
    })
    openAddGoods.value = false;
  }
};
// Preload data(Cache)
getRegionList();
getVendorList();
getVmTypeList();
getLocationList();
getList();
getPolicyList();
getGoodsList();
</script>

<style scoped>
/* Grid styling for 3 rows and 4 columns layout */
.item-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 4 columns */
  grid-template-rows: repeat(3, 1fr);
  /* 3 rows */
  gap: 15px;
  padding: 20px;
}

/* Styling for each item card */
.item-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  background: #f0f0f0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}
</style>