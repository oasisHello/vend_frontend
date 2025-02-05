<template>
    <el-dialog title="Policy Selection" v-model="openDialog" width="500px" append-to-body>
        <el-form ref="policyInfoRef" :model="form" label-width="100px">
            <el-form-item label="Policy" prop="policyId">
                <el-select v-model="form.policyId" placeholder="Policy">
                    <el-option v-for="item in policyList" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">Confirm</el-button>
                <el-button @click="cancel">Cancel</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
    open: Boolean,
    form: Object,
    policyList: Array,
});

const emit = defineEmits(["confirm", "update:open"]);

const openDialog = computed({
    get: () => props.open,
    set: (value) => emit("update:open", value),
});

const submitForm = () => {
    emit("confirm", props.form);
};

const cancel = () => {
    emit("update:open", false);
};
</script>

<style scoped>
.dialog-footer {
    margin-right: 10px;
}
</style>