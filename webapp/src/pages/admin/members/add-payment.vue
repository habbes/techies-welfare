<template>
    <UiCard>
        <UiH3>Register payment made offline</UiH3>
        <UiForm class="w-1/2" @submit="submitForm">
            <UiLayout smallGap vertical>
                <UiNumberInput
                    v-model="amount"
                    label="Amount"
                    required
                    full/>
                <UiTextInput
                    v-model="reference"
                    label="Transaction reference"
                    required
                    full/>
                <UiLayout smallGap>
                    <UiDateInput
                        v-model="txDate"
                        label="Transaction Date"
                        required/>

                    <UiTimeInput
                        v-model="txTime"
                        label="Time"
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
        </UiForm>
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
import {
    UiInputGroup,
    UiTextInput,
    UiTextArea,
    UiLayout,
    UiDialog,
    UiCard,
    UiH3,
    UiButton,
    UiText,
    UiNumberInput,
    UiDateInput,
    UiTimeInput,
    UiForm
} from "../../../ui-components";

export default defineComponent({
    components: {
        UiInputGroup,
        UiTextInput,
        UiTextArea,
        UiLayout,
        UiDialog,
        UiCard,
        UiH3,
        UiButton,
        UiText,
        UiNumberInput,
        UiDateInput,
        UiTimeInput,
        UiForm },
    props: {
        user: Object,
    },
    emits: ['cancel', 'addPayment'],
    setup(props, { emit }) {
        const amount = ref(0);
        const txDate = ref(new Date());
        const txTime = ref({ hour: 0, minute: 0});
        const details = ref('');
        const reference = ref('');
        const confirmDialog = ref();

        const dateTime = computed(() => {
            const d = new Date(txDate.value);
            d.setHours(txTime.value.hour);
            d.setMinutes(txTime.value.minute);

            return d;
        });

        function resetForm() {
            amount.value = 0;
            txDate.value = new Date();
            txTime.value = { hour: 0, minute: 0 };
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
