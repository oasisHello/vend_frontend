<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="aisle Code" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入aisle Code"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="SKU ID" prop="skuId">
        <el-input
          v-model="queryParams.skuId"
          placeholder="请输入SKU ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Machine ID" prop="vmId">
        <el-input
          v-model="queryParams.vmId"
          placeholder="请输入Machine ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Inner Code" prop="innerCode">
        <el-input
          v-model="queryParams.innerCode"
          placeholder="请输入Inner Code"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Max Capacity" prop="maxCapacity">
        <el-input
          v-model="queryParams.maxCapacity"
          placeholder="请输入Max Capacity"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Current Capacity" prop="currentCapacity">
        <el-input
          v-model="queryParams.currentCapacity"
          placeholder="请输入Current Capacity"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Last Supply Time" prop="lastSupplyTime">
        <el-date-picker clearable
          v-model="queryParams.lastSupplyTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择Last Supply Time">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['manage:aisle:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:aisle:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:aisle:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:aisle:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="aisleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Channel ID" align="center" prop="id" />
      <el-table-column label="aisle Code" align="center" prop="code" />
      <el-table-column label="SKU ID" align="center" prop="skuId" />
      <el-table-column label="Machine ID" align="center" prop="vmId" />
      <el-table-column label="Inner Code" align="center" prop="innerCode" />
      <el-table-column label="Max Capacity" align="center" prop="maxCapacity" />
      <el-table-column label="Current Capacity" align="center" prop="currentCapacity" />
      <el-table-column label="Last Supply Time" align="center" prop="lastSupplyTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.lastSupplyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:aisle:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:aisle:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改Aisle Information对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="aisleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="aisle Code" prop="code">
          <el-input v-model="form.code" placeholder="请输入aisle Code" />
        </el-form-item>
        <el-form-item label="SKU ID" prop="skuId">
          <el-input v-model="form.skuId" placeholder="请输入SKU ID" />
        </el-form-item>
        <el-form-item label="Machine ID" prop="vmId">
          <el-input v-model="form.vmId" placeholder="请输入Machine ID" />
        </el-form-item>
        <el-form-item label="Inner Code" prop="innerCode">
          <el-input v-model="form.innerCode" placeholder="请输入Inner Code" />
        </el-form-item>
        <el-form-item label="Max Capacity" prop="maxCapacity">
          <el-input v-model="form.maxCapacity" placeholder="请输入Max Capacity" />
        </el-form-item>
        <el-form-item label="Current Capacity" prop="currentCapacity">
          <el-input v-model="form.currentCapacity" placeholder="请输入Current Capacity" />
        </el-form-item>
        <el-form-item label="Last Supply Time" prop="lastSupplyTime">
          <el-date-picker clearable
            v-model="form.lastSupplyTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择Last Supply Time">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Aisle">
import { listAisle, getAisle, delAisle, addAisle, updateAisle } from "@/api/manage/aisle";

const { proxy } = getCurrentInstance();

const aisleList = ref([]);
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
    code: null,
    skuId: null,
    vmId: null,
    innerCode: null,
    maxCapacity: null,
    currentCapacity: null,
    lastSupplyTime: null,
  },
  rules: {
    code: [
      { required: true, message: "aisle Code不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询Aisle Information列表 */
function getList() {
  loading.value = true;
  listAisle(queryParams.value).then(response => {
    aisleList.value = response.rows;
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
    code: null,
    skuId: null,
    vmId: null,
    innerCode: null,
    maxCapacity: null,
    currentCapacity: null,
    lastSupplyTime: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("aisleRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加Aisle Information";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getAisle(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改Aisle Information";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["aisleRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAisle(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAisle(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除Aisle Information编号为"' + _ids + '"的数据项？').then(function() {
    return delAisle(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/aisle/export', {
    ...queryParams.value
  }, `aisle_${new Date().getTime()}.xlsx`)
}

getList();
</script>
