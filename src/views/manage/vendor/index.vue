<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入name"
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
          v-hasPermi="['manage:vendor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:vendor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:vendor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:vendor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vendorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="name" align="center" prop="name" />
      <el-table-column label="contactor" align="center" prop="contactor" />
      <el-table-column label="phone" align="center" prop="phone" />
      <el-table-column label="ratio" align="center" prop="ratio" />
      <el-table-column label="acccount" align="center" prop="account" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:vendor:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:vendor:remove']">删除</el-button>
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

    <!-- 添加或修改vendor对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vendorRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" placeholder="请输入name" />
        </el-form-item>
        <el-form-item label="contactor" prop="contactor">
          <el-input v-model="form.contactor" placeholder="请输入contactor" />
        </el-form-item>
        <el-form-item label="phone" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入phone" />
        </el-form-item>
        <el-form-item label="ratio" prop="ratio">
          <el-input v-model="form.ratio" placeholder="请输入ratio" />
        </el-form-item>
        <el-form-item label="acccount" prop="account">
          <el-input v-model="form.account" placeholder="请输入acccount" />
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="form.password" placeholder="请输入password" />
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

<script setup name="Vendor">
import { listVendor, getVendor, delVendor, addVendor, updateVendor } from "@/api/manage/vendor";

const { proxy } = getCurrentInstance();

const vendorList = ref([]);
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
  },
  rules: {
    name: [
      { required: true, message: "name不能为空", trigger: "blur" }
    ],
    contactor: [
      { required: true, message: "contactor不能为空", trigger: "blur" }
    ],
    phone: [
      { required: true, message: "phone不能为空", trigger: "blur" }
    ],
    ratio: [
      { required: true, message: "ratio不能为空", trigger: "blur" }
    ],
    account: [
      { required: true, message: "acccount不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "password不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询vendor列表 */
function getList() {
  loading.value = true;
  listVendor(queryParams.value).then(response => {
    vendorList.value = response.rows;
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
    contactor: null,
    phone: null,
    ratio: null,
    account: null,
    password: null,
    createdTime: null,
    modifiedTime: null,
    remark: null,
    createdBy: null,
    modifiedBy: null
  };
  proxy.resetForm("vendorRef");
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
  title.value = "添加vendor";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getVendor(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改vendor";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vendorRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateVendor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVendor(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除vendor编号为"' + _ids + '"的数据项？').then(function() {
    return delVendor(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/vendor/export', {
    ...queryParams.value
  }, `vendor_${new Date().getTime()}.xlsx`)
}

getList();
</script>
