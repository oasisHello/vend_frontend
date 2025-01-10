<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="Name" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入Type Name" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manage:vmType:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['manage:vmType:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['manage:vmType:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['manage:vmType:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vmTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Code" align="center" prop="code" />
      <el-table-column label="Image" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="Rows" align="center" prop="rowCount" />
      <el-table-column label="Columns" align="center" prop="colCount" />
      <el-table-column label="Capacity per Aisle" align="center" prop="aisleMaxCapacity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:vmType:edit']">修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)"
            v-hasPermi="['manage:vmType:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改Machine Types对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vmTypeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="请输入Type Name" />
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" placeholder="请输入Code" />
        </el-form-item>
        <el-form-item label="Aisle Num" prop="rowCount">
          <el-input-number v-model="form.rowCount" :min="1" :max="10" placeholder="请输入Number of Rows" /> Row
          &nbsp;&nbsp;
          <el-input-number v-model="form.colCount" :min="1" :max="10" placeholder="请输入Number of Columns" /> Col
        </el-form-item>
        <el-form-item label="Capacity" prop="aisleMaxCapacity">
          <el-input-number v-model="form.aisleMaxCapacity" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="Image" prop="image">
          <image-upload v-model="form.image" />
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

<script setup name="VmType">
import { listVmType, getVmType, delVmType, addVmType, updateVmType } from "@/api/manage/vmType";

const { proxy } = getCurrentInstance();

const vmTypeList = ref([]);
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
    code: null,
  },
  rules: {
    name: [
      { required: true, message: "Type Name不能为空", trigger: "blur" }
    ],
    code: [
      { required: true, message: "Code不能为空", trigger: "blur" }
    ],
    image: [
      { required: true, message: "Image URL不能为空", trigger: "blur" }
    ],
    rowCount: [
      { required: true, message: "Number of Rows不能为空", trigger: "blur" }
    ],
    colCount: [
      { required: true, message: "Number of Columns不能为空", trigger: "blur" }
    ],
    aisleMaxCapacity: [
      { required: true, message: "Maximum Capacity per Aisle不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询Machine Types列表 */
function getList() {
  loading.value = true;
  listVmType(queryParams.value).then(response => {
    vmTypeList.value = response.rows;
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
    name: null,
    code: null,
    image: null,
    rowCount: null,
    colCount: null,
    aisleMaxCapacity: null
  };
  proxy.resetForm("vmTypeRef");
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
  title.value = "Add Machine Types";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getVmType(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "Modify Machine Types";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vmTypeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateVmType(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVmType(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除Machine Types编号为"' + _ids + '"的数据项？').then(function () {
    return delVmType(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/vmType/export', {
    ...queryParams.value
  }, `vmType_${new Date().getTime()}.xlsx`)
}

getList();
</script>
