<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="Name" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入Name" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入Code" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="Type" prop="goodsTypeId">

        <el-select v-model="queryParams.goodsTypeId" placeholder="Please Select Type" clearable
          @keyup.enter="handleQuery">
          <el-option v-for="item in goodsTypeList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['manage:goods:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['manage:goods:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['manage:goods:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['manage:goods:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Upload" @click="handleUpload"
          v-hasPermi="['manage:goods:add']">Upload</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Seq" align="center" type="index" prop="id" />
      <el-table-column label="name" align="center" prop="name" />
      <el-table-column label="code" align="center" prop="code" />
      <el-table-column label="image" align="center" prop="image" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="brand" align="center" prop="brandName" />
      <el-table-column label="unit" align="center" prop="unit" />
      <el-table-column label="price(jpy)" align="center" prop="price">
        <template #default="scope">
          <el-tag type="success"> {{ scope.row.price }} 円</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="product type" align="center">
        <template #default="scope">
          <div v-for="item in goodsTypeList" :key="item.id">
            <span v-if="item.id === scope.row.goodsTypeId">{{ item.name }} </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="create time" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)"
            v-hasPermi="['manage:goods:edit']">修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)"
            v-hasPermi="['manage:goods:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改Product table对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="goodsRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" placeholder="请输入Name" />
        </el-form-item>
        <el-form-item label="code" prop="code">
          <span>{{ form.code == null ? "Auto Generated" : form.code }}</span>
        </el-form-item>
        <el-form-item label="brand" prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入Brand name" />
        </el-form-item>
        <el-form-item label="unit" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入Unit" />
        </el-form-item>
        <el-form-item label="price" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="1" placeholder="请输入Price" /> 円
        </el-form-item>
        <el-form-item label="product type" prop="goodsTypeId">
          <el-select v-model="form.goodsTypeId" placeholder="please select product type">
            <el-option v-for="item in goodsTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="image" prop="image">
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

    <!-- Upload dialog -->
    <el-dialog title="Upload Goods From Excel" v-model="uploadOpen" width="500px" append-to-body>
      <!-- from element plus-->
      <el-upload ref="uploadRef" class="upload-demo" :action="uploadExcelUrl" :on-success="handleUploadSuccess" :headers="headers"  :on-error="handleUploadError" :before-upload="handleBeforeUpload"  :limit ="1" :auto-upload="false">
        <template #trigger>
          <el-button type="primary">select</el-button>
        </template>

        <el-button class="ml-3" type="success" @click="submitUpload">
          upload to server
        </el-button>

        <template #tip>
          <div class="el-upload__tip">
            Only xlsx/xls files can be uploaded within 1MB.
          </div>
        </template>
      </el-upload>

    </el-dialog>
  </div>
</template>

<script setup name="Goods">
import { listGoods, getGoods, delGoods, addGoods, updateGoods } from "@/api/manage/goods";
import { listGoods_type } from "@/api/manage/goods_type";
import { loadAllParams } from "@/api/page";
import { getToken } from "@/utils/auth";
import { get } from "@vueuse/core";

const { proxy } = getCurrentInstance();

const goodsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
/** excel upload url */
const uploadExcelUrl = ref(import.meta.env.VITE_APP_BASE_API + "/manage/goods/import"); // 上传文件服务器地址
/** headers */
const headers = ref({ Authorization: "Bearer " + getToken() });

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    code: null,
    goodsTypeId: null,
  },
  rules: {
    name: [
      { required: true, message: "Name不能为空", trigger: "blur" }
    ],
    price: [
      { required: true, message: "Price不能为空", trigger: "blur" }
    ],
    goodsTypeId: [
      { required: true, message: "Product type ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询Product table列表 */
function getList() {
  loading.value = true;
  listGoods(queryParams.value).then(response => {
    goodsList.value = response.rows;
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
    brandName: null,
    unit: null,
    price: null,
    goodsTypeId: null,
    isDiscount: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("goodsRef");
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
  title.value = "添加Product table";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getGoods(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改Product table";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["goodsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateGoods(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addGoods(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除Product table编号为"' + _ids + '"的数据项？').then(function () {
    return delGoods(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('manage/goods/export', {
    ...queryParams.value
  }, `goods_${new Date().getTime()}.xlsx`)
}
/** upload button */
const uploadOpen = ref(false);
// open the upload dialog
function handleUpload() {
  uploadOpen.value = true;
}

/** goods type */
const goodsTypeList = ref([]);
function getGoodsTypeList() {
  listGoods_type(loadAllParams).then(response => {
    goodsTypeList.value = response.rows;
  });
}

const uploadRef = ref({});
function submitUpload() {
  uploadRef.value.submit();
}

const uploadList = ref([]);
// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.code === 200) {
    uploadList.value.push({ name: res.fileName, url: res.fileName });
    proxy.$modal.msgSuccess("Successfully uploaded the file: " + res.fileName);
    uploadOpen.value = false;// close upload dialog
    getList();// refresh list
  } else {
    proxy.$modal.msgError(res.msg);
  }
  uploadRef.value.clearFiles();// NOTE: what is uploadref exactly?
  proxy.$modal.closeLoading();
}

// upload failed callback
function handleUploadError(err, file) {
  proxy.$modal.msgError("Excel upload failed");
  proxy.$modal.closeLoading();
}

// predefined before upload
const props = defineProps({
  modelValue: [String, Object, Array],
  
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // xls、xlsx
  fileType: {
    type: Array,
    default: () => ["xls", "xlsx"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
});
/** handle before upload */
function handleBeforeUpload(file) {
  let isExcel = false;
  if (props.fileType.length) {
    let fileExtension = "";
    if (file.name.lastIndexOf(".") > -1) { // NOTE: whether file name has "." or not
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1); // NOTE: get file extension
    }
    isExcel = props.fileType.some(type => {
      if (file.type.indexOf(type) > -1) return true;// NOTE: the type of file(uploaded) matches the predefined type.
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;//NOTE the extension of file(uploaded) matches the predefined extension.
      return false;
    });
  } 
  if (!isExcel) {
    proxy.$modal.msgError(
      `Invalid file format. Please upload a file with one of these extensions: ${props.fileType.join(", ")}.`
    );
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`upload file size cannot exceed ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("Excel uploading, please wait...");
}

getGoodsTypeList();// preload goods type
getList();
</script>
