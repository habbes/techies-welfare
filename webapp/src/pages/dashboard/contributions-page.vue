<template>
    <UiLayout vertical>
        <UiLayout justify="between">
            <UiLayout>
                <UiH2>My contributions</UiH2>
            </UiLayout>
            <UiLayout align="center" smallGap>
                <UiLayout smallGap v-if="accountSummary">
                    <UiLayout tinyGap>
                        <UiText class="font-semibold">Total contribution:</UiText>
                        <UiText>Ksh {{ accountSummary.totalContribution }}</UiText>
                    </UiLayout>
                    <UiLayout tinyGap>
                        <UiText class="font-semibold">Arrears:</UiText>
                        <UiText>Ksh {{ accountSummary.arrears }}</UiText>
                    </UiLayout>
                </UiLayout>
                <UiButton primary @click="openPaymentDialog">Make contribution</UiButton>
            </UiLayout>
        </UiLayout>
        <UiLayout vertical>
            <TransactionsTable :transactions="transactions" :getTransactionRoute="getTransactionRoute" />
        </UiLayout>
        <PaymentDialog ref="paymentDialog" />
    </UiLayout>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { ITransaction } from '../../services';
import { apiClient } from "../../api-client";
import { useUser } from "../../store";
import { showError } from "../../toasts";
import {
    UiLayout,
    UiText,
    UiH2,
    UiButton
} from "../../ui-components";
import TransactionsTable from "../../components/transactions-table.vue";
import PaymentDialog from "../../components/payment-dialog.vue";

const transactions = ref<ITransaction[]>([]);
const paymentDialog = ref<typeof PaymentDialog>();
const userStore = useUser();
const accountSummary = userStore.accountSummary;

onMounted(async() => {
    try {
        transactions.value = await apiClient.getMyTransactions();
    }
    catch (e: any) {
        showError(e.message);
    }
});

function openPaymentDialog() {
    paymentDialog.value?.open();
}

function getTransactionRoute(trx: ITransaction) {
    return { name: 'my-payment-details', params: { id: trx._id } };
}
</script>
