<template>
    <div class="item-card">
      <!-- Display Image -->
      <img :src="item.goods.image" alt="Item Image" class="item-image" />
      
      <!-- Item Name -->
      <p class="item-name">{{ item.code }}</p>
  
      <!-- Control Buttons -->
      <div class="item-buttons">
        <el-button type="primary" @click="addItem">Add</el-button>
        <el-button type="danger" @click="removeItem">Remove</el-button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['add-item', 'remove-item']);
  
  const addItem = () => emit('add-item', props.item);
  const removeItem = () => emit('remove-item', props.item);
  </script>
  
  <style scoped>

.item-card {
  height: 15vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.item-image {
  width: auto;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
}

.item-name {
  margin: 5px 0;
  font-size: 14px;
  font-weight: bold;
}

.item-buttons {
  margin-top: -0px;
  display: flex;
  justify-content: center;
  gap: 3px;
  font-size: 10px;
}
  </style>