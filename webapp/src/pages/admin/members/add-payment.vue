<template>
    <ui-card>
        <ui-h3>Register payment made offline</ui-h3>
        <form class="w-1/2" @submit.prevent="submitForm">
            <ui-text-input
                v-model="amount"
                label="Amount"
                type="number"
                required
                full
                class="mb-3"/>
            <ui-text-input
                v-model="reference"
                label="Transaction reference"
                required
                full
                class="mb-3"/>
            <div class="flex gap-3">
                <ui-text-input
                v-model="txDate"
                label="Transaction Date"
                type="date"
                required/>

                <ui-text-input
                v-model="txTime"
                label="Time"
                type="time"
                required/>
            </div>
            <ui-text-area
                v-model="details"
                label="Additional details"
                full
                class="mb-3"/>
            <div class="flex gap-3">
                <ui-button submit>Register payment</ui-button>
                <ui-button @click="cancel">Cancel</ui-button>
            </div>
        </form>
        <ui-dialog ref="confirmDialog" title="Confirm payment details">
            <div>
                <div>Member: <span class="font-mono font-semibold">{{ user.name }} ({{ user.phone }})</span></div>
                <div>Amount: <span class="font-mono font-semibold">{{ amount }}</span></div>
                <div>Reference: <span class="font-mono font-semibold">{{ reference }}</span></div>
                <div>Date: <span class="font-mono font-semibold">{{ dateTime.toLocaleString() }}</span></div>
                <div>Additional details:</div>
                <div class="font-mono font-semibold">{{ details || 'N/A' }}</div>
            </div>
            <div class="mt-3 flex justify-end gap-3">
                <ui-button @click="addPayment">Proceed to register member</ui-button>
                <ui-button @click="closeDialog">Cancel</ui-button>
            </div>
        </ui-dialog>
    </ui-card>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { apiClient } from "../../../api-client";

export default defineComponent({
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
                    recordedBy: 'test', // TODO: this should be added on backend
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
