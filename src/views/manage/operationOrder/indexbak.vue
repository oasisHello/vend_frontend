<template>
  <div class="app-container">
    <el-form :model="form" ref="formRef" label-width="120px" class="form-container">
      <!-- createType -->
      <el-form-item label="Create Type" prop="createType">
        <el-input v-model="form.createType" placeholder="Enter Create Type" />
      </el-form-item>

      <!-- innerCode -->
      <el-form-item label="Inner Code" prop="innerCode">
        <el-input v-model="form.innerCode" placeholder="Enter Inner Code" />
      </el-form-item>

      <!-- userId -->
      <el-form-item label="User ID" prop="userId">
        <el-input-number v-model="form.userId" placeholder="Enter User ID" />
      </el-form-item>

      <!-- assignorId -->
      <el-form-item label="Assignor ID" prop="assignorId">
        <el-input-number v-model="form.assignorId" placeholder="Enter Assignor ID" />
      </el-form-item>

      <!-- typeId -->
      <el-form-item label="Type ID" prop="typeId">
        <el-input-number v-model="form.typeId" placeholder="Enter Type ID" />
      </el-form-item>

      <!-- remark -->
      <el-form-item label="Remark" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="Enter Remark" />
      </el-form-item>

      <!-- Details Section -->
      <el-form-item label="Details" v-for="(detail, index) in form.details" :key="index">
        <el-row :gutter="10">
          <!-- aisleCode -->
          <el-col :span="6">
            <el-form-item label="Aisle Code" prop="details[${index}].aisleCode">
              <el-input v-model="detail.aisleCode" placeholder="Enter Aisle Code" />
            </el-form-item>
          </el-col>

          <!-- availableCapacity -->
          <el-col :span="6">
            <el-form-item label="Available Capacity" prop="details[${index}].avaliableCapacity">
              <el-input-number v-model="detail.avaliableCapacity" placeholder="Enter Available Capacity" />
            </el-form-item>
          </el-col>

          <!-- goodsId -->
          <el-col :span="6">
            <el-form-item label="Goods ID" prop="details[${index}].goodsId">
              <el-input v-model="detail.goodsId" placeholder="Enter Goods ID" />
            </el-form-item>
          </el-col>

          <!-- goodsName -->
          <el-col :span="6">
            <el-form-item label="Goods Name" prop="details[${index}].goodsName">
              <el-input v-model="detail.goodsName" placeholder="Enter Goods Name" />
            </el-form-item>
          </el-col>

          <!-- goodsImage -->
          <el-col :span="6">
            <el-form-item label="Goods Image" prop="details[${index}].goodsImage">
              <el-upload
                class="upload-demo"
                drag
                action="/upload"
                :on-success="handleImageSuccess"
                :file-list="detail.goodsImage ? [detail.goodsImage] : []"
                :auto-upload="false">
                <el-button size="small" type="primary">Upload Image</el-button>
              </el-upload>
            </el-form-item>
          </el-col>

          <!-- Remove Detail Button -->
          <el-col :span="6">
            <el-button type="danger" @click="removeDetail(index)">Remove</el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- Add Detail Button -->
      <el-form-item>
        <el-button type="primary" @click="addDetail">Add Detail</el-button>
      </el-form-item>

      <!-- Submit Form -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="cancelForm">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "CreateOrder",
  setup() {
    const form = ref({
      createType: "",
      innerCode: "",
      userId: null,
      assignorId: null,
      typeId: null,
      remark: "",
      details: [
        {
          aisleCode: "",
          avaliableCapacity: null,
          goodsId: "",
          goodsName: "",
          goodsImage: null,
        },
      ],
    });

    // Add a new detail to the form
    const addDetail = () => {
      form.value.details.push({
        aisleCode: "",
        avaliableCapacity: null,
        goodsId: "",
        goodsName: "",
        goodsImage: null,
      });
    };

    // Remove a detail from the form
    const removeDetail = (index) => {
      form.value.details.splice(index, 1);
    };

    // Handle image upload success
    const handleImageSuccess = (response, file, fileList) => {
      // Assuming the response contains the image URL
      fileList[0].url = response.url;
    };

    // Submit the form data
    const submitForm = () => {
      console.log("Form Submitted:", form.value);
      // You can make an API request to submit the form here
    };

    // Cancel form
    const cancelForm = () => {
      form.value = {
        createType: "",
        innerCode: "",
        userId: null,
        assignorId: null,
        typeId: null,
        remark: "",
        details: [
          {
            aisleCode: "",
            avaliableCapacity: null,
            goodsId: "",
            goodsName: "",
            goodsImage: null,
          },
        ],
      };
    };

    return {
      form,
      addDetail,
      removeDetail,
      submitForm,
      cancelForm,
      handleImageSuccess,
    };
  },
};
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.upload-demo {
  width: 100%;
  padding: 10px 0;
}
</style>
