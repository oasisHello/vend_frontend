<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
          v-hasPermi="['manage:operationDetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['manage:operationDetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['manage:operationDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['manage:operationDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="operationDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="Order ID" align="center" prop="orderId" />
      <el-table-column label="Aisle code" align="center" prop="aisleCode" />
      <el-table-column label="Available capacity" align="center" prop="avaliableCapacity" />
      <el-table-column label="Goods ID" align="center" prop="goodsId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['manage:operationDetail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['manage:operationDetail:remove']">删除</el-button>
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

    <!-- 添加或修改Operation detail table对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="operationDetailRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Order ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入Order ID" />
        </el-form-item>
        <el-form-item label="Aisle code" prop="aisleCode">
          <el-input v-model="form.aisleCode" placeholder="请输入Aisle code" />
        </el-form-item>
        <el-form-item label="Available capacity" prop="avaliableCapacity">
          <el-input v-model="form.avaliableCapacity" placeholder="请输入Available capacity" />
        </el-form-item>
        <el-form-item label="Goods ID" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入Goods ID" />
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

<script setup name="OperationDetail">
import { listOperationDetail, getOperationDetail, delOperationDetail, addOperationDetail, updateOperationDetail } from "@/api/manage/operationDetail";

const { proxy } = getCurrentInstance();

const operationDetailList = ref([]);
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
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询Operation detail table列表 */
function getList() {
  loading.value = true;
  listOperationDetail(queryParams.value).then(response => {
    operationDetailList.value = response.rows;
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
    orderId: null,
    aisleCode: null,
    avaliableCapacity: null,
    goodsId: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("operationDetailRef");
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
  title.value = "添加Operation detail table";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getOperationDetail(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改Operation detail table";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["operationDetailRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOperationDetail(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOperationDetail(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除Operation detail table编号为"' + _ids + '"的数据项？').then(function() {
    return delOperationDetail(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/operationDetail/export', {
    ...queryParams.value
  }, `operationDetail_${new Date().getTime()}.xlsx`)
}

getList();
</script>
