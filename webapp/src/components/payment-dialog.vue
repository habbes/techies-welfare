<template>
    <UiDialog ref="dialog" title="Make contribution">
        <UiForm @submit="initiatePayment">
            <UiLayout vertical smallGap>
                <UiNumberInput label="Amount to contribute" required full v-model="amount" />
                <UiText sm secondary>
                    The payment provider may add
                    a transaction fee on top of the amount.
                </UiText>
                <UiLayout smallGap>
                    <UiButton primary submit>Proceed to pay</UiButton>
                    <UiButton @click="close" secondary>Cancel</UiButton>
                </UiLayout>
            </UiLayout>
        </UiForm>
    </UiDialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import {
    UiDialog,
    UiNumberInput,
    UiLayout,
    UiButton,
    UiForm,
    UiText
} from "../ui-components";
import { apiClient } from "../api-client";
import { showError } from "../toasts";

const props = defineProps<{
    defaultAmount?: number
}>();

const dialog = ref<typeof UiDialog>();
const amount = ref(props.defaultAmount ?? 1000);

function open() {
    dialog.value?.open();
}

function close() {
    resetForm();
    dialog.value?.close();
}

function resetForm() {
    amount.value = props.defaultAmount ?? 1000;
}

async function initiatePayment() {
    try {
        const trx = await apiClient.initiateMyPayment({ amount: amount.value, type: 'contribution' });
        if (trx && trx.metadata && trx.metadata.paymentUrl) {
            window.location = trx.metadata.paymentUrl;
        }
    }
    catch (e: any) {
        showError(e.message);
    }
}

defineExpose({
    open,
    close
});
</script>
