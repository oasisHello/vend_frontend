<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="Name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入Name"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Model" prop="model">
        <el-input
          v-model="queryParams.model"
          placeholder="请输入Model"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['manage:vm_type:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:vm_type:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:vm_type:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:vm_type:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vm_typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Name" align="center" prop="name" />
      <el-table-column label="Model" align="center" prop="model" />
      <el-table-column label="Image" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="Rows" align="center" prop="vmRow" />
      <el-table-column label="Columns" align="center" prop="vmCol" />
      <el-table-column label="Max Capacity" align="center" prop="aisleMaxCapacity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:vm_type:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:vm_type:remove']">删除</el-button>
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

    <!-- 添加或修改Vending Machine Types对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vm_typeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="请输入Name" />
        </el-form-item>
        <el-form-item label="Model" prop="model">
          <el-input v-model="form.model" placeholder="请输入Model" />
        </el-form-item>
        <el-form-item label="Image" prop="image">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="Rows" prop="vmRow">
          <el-input v-model="form.vmRow" placeholder="请输入Rows" />
        </el-form-item>
        <el-form-item label="Columns" prop="vmCol">
          <el-input v-model="form.vmCol" placeholder="请输入Columns" />
        </el-form-item>
        <el-form-item label="Max Capacity" prop="aisleMaxCapacity">
          <el-input v-model="form.aisleMaxCapacity" placeholder="请输入Max Capacity" />
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

<script setup name="Vm_type">
import { listVm_type, getVm_type, delVm_type, addVm_type, updateVm_type } from "@/api/manage/vm_type";

const { proxy } = getCurrentInstance();

const vm_typeList = ref([]);
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
    model: null,
  },
  rules: {
    name: [
      { required: true, message: "Name不能为空", trigger: "blur" }
    ],
    model: [
      { required: true, message: "Model不能为空", trigger: "blur" }
    ],
    image: [
      { required: true, message: "Image不能为空", trigger: "blur" }
    ],
    vmRow: [
      { required: true, message: "Rows不能为空", trigger: "blur" }
    ],
    vmCol: [
      { required: true, message: "Columns不能为空", trigger: "blur" }
    ],
    aisleMaxCapacity: [
      { required: true, message: "Max Capacity不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询Vending Machine Types列表 */
function getList() {
  loading.value = true;
  listVm_type(queryParams.value).then(response => {
    vm_typeList.value = response.rows;
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
    model: null,
    image: null,
    vmRow: null,
    vmCol: null,
    aisleMaxCapacity: null
  };
  proxy.resetForm("vm_typeRef");
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
  title.value = "添加Vending Machine Types";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getVm_type(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改Vending Machine Types";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vm_typeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateVm_type(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVm_type(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除Vending Machine Types编号为"' + _ids + '"的数据项？').then(function() {
    return delVm_type(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/vm_type/export', {
    ...queryParams.value
  }, `vm_type_${new Date().getTime()}.xlsx`)
}

getList();
</script>
