<template>
    <UiDialog ref="dialog" title="Make contribution">
        <form @submit.prevent="initiatePayment">
            <UiTextInput required type="number" full v-model="amount" />
            <UiLayout class="mt-3 gap-3">
                <UiButton primary submit>Proceed to pay</UiButton>
                <UiButton @click="close" secondary>Cancel</UiButton>
            </UiLayout>
        </form>
    </UiDialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UiDialog, UiTextInput, UiLayout, UiButton } from "../ui-components";
import { apiClient } from "../api-client";
import { showError } from "../toasts";

export default defineComponent({
    components: { UiDialog, UiTextInput, UiLayout, UiButton },
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
            amount.value = props.defaultAmount;
        }

        async function initiatePayment() {
            try {
                const trx = await apiClient.initiateMyPayment({ amount: amount.value, type: 'contribution' });
                if (trx && trx.metadata && trx.metadata.paymentUrl) {
                    window.location = trx.metadata.paymentUrl;
                }
            }
            catch (e) {
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
