<template>
    <UiCard>
        <UiH3>Register payment made offline</UiH3>
        <form class="w-1/2" @submit.prevent="submitForm">
            <UiLayout smallGap vertical>
                <UiTextInput
                    v-model="amount"
                    label="Amount"
                    type="number"
                    required
                    full/>
                <UiTextInput
                    v-model="reference"
                    label="Transaction reference"
                    required
                    full/>
                <UiLayout smallGap>
                    <UiTextInput
                    v-model="txDate"
                    label="Transaction Date"
                    type="date"
                    required/>

                    <UiTextInput
                    v-model="txTime"
                    label="Time"
                    type="time"
                    required/>
                </UiLayout>
                <UiTextArea
                    v-model="details"
                    label="Additional details"
                    full/>
                <UiLayout smallGap>
                    <UiButton submit>Register payment</UiButton>
                    <UiButton @click="cancel" secondary>Cancel</UiButton>
                </UiLayout>
            </UiLayout>
        </form>
        <UiDialog ref="confirmDialog" title="Confirm payment details">
            <UiLayout vertical smallGap>
                <UiLayout vertical tinyGap>
                    <UiLayout smallGap>Member: <UiText monospace bold>{{ user.name }} ({{ user.phone }})</UiText></UiLayout>
                    <UiLayout smallGap>Amount: <UiText monospace bold>{{ amount }}</UiText></UiLayout>
                    <UiLayout smallGap>Reference: <UiText monospace bold>{{ reference }}</UiText></UiLayout>
                    <UiLayout smallGap>Date: <UiText monospace bold>{{ dateTime.toLocaleString() }}</UiText></UiLayout>
                    <UiLayout vertical>
                        <UiText secondary>Additional details:</UiText>
                        <UiLayout><UiText>{{ details || 'N/A' }}</UiText></UiLayout>
                    </UiLayout>
                </UiLayout>
                <UiLayout smallGap>
                    <UiButton @click="addPayment">Proceed to register payment</UiButton>
                    <UiButton @click="closeDialog" secondary>Cancel</UiButton>
                </UiLayout>
            </UiLayout>
        </UiDialog>
    </UiCard>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { apiClient } from "../../../api-client";
import { UiInputGroup, UiTextInput, UiTextArea, UiLayout, UiDialog, UiCard, UiH3, UiButton, UiText } from "../../../ui-components";

export default defineComponent({
    components: { UiInputGroup, UiTextInput, UiTextArea, UiLayout, UiDialog, UiCard, UiH3, UiButton, UiText },
    props: {
        user: Object,
    },
    emits: ['cancel', 'addPayment'],
    setup(props, { emit }) {
        const amount = ref(0);
        const txDate = ref(new Date().toISOString().split("T")[0]);
        const txTime = ref("00:00");
        const details = ref('');
        const reference = ref('');
        const confirmDialog = ref();

        const dateTime = computed(() => {
            const d = new Date(txDate.value);
            const [h, m] = txTime.value.split(":");
            d.setHours(Number(h));
            d.setMinutes(Number(m));

            return d;
        });

        function resetForm() {
            amount.value = 0;
            txDate.value = new Date().toISOString().split("T")[0];
            txTime.value = "00:00";
            details.value = '';
            reference.value = '';
        }

        function cancel() {
            resetForm();
            emit("cancel");
        }

        function submitForm() {
            openDialog();
        }

        function openDialog() {
            confirmDialog.value.open();
        }

        function closeDialog() {
            confirmDialog.value.close();
        }

        async function addPayment() {
            const args = {
                amount: Number(amount.value),
                fromUser: props.user._id,
                id: reference.value,
                metadata: {
                    transactionDate: dateTime.value,
                    details: details.value
                }
            };
            try {
                const res = await apiClient.addManualPayment(args);
                resetForm();
                closeDialog();
                emit("addPayment", res);
            }
            catch (e) {
                alert(e.message);
            }
        }

        return {
            amount,
            txDate,
            txTime,
            dateTime,
            details,
            reference,
            cancel,
            submitForm,
            openDialog,
            closeDialog,
            confirmDialog,
            addPayment,
        };
    },
})
</script>
