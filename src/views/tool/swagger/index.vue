<template>
   <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import iFrame from '@/components/iFrame'

const url = ref(import.meta.env.VITE_APP_BASE_API + "/doc.html#/home/en-US");//support English,https://doc.xiaominfo.com/docs/features/i18n
</script>
