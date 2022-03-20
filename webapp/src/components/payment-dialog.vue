<template>
    <UiDialog ref="dialog" title="Make contribution">
        <UiForm @submit="initiatePayment">
            <UiNumberInput required type="number" full v-model="amount" />
            <UiLayout class="mt-3 gap-3">
                <UiButton primary submit>Proceed to pay</UiButton>
                <UiButton @click="close" secondary>Cancel</UiButton>
            </UiLayout>
        </UiForm>
    </UiDialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UiDialog, UiNumberInput, UiLayout, UiButton, UiForm } from "../ui-components";
import { apiClient } from "../api-client";
import { showError } from "../toasts";

export default defineComponent({
    components: { UiDialog, UiNumberInput, UiLayout, UiButton, UiForm },
    props: {
        defaultAmount: Number,
    },
    setup(props) {
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

        return {
            open,
            close,
            amount,
            dialog,
            initiatePayment
        }
    },
})
</script>
