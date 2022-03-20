<template>
    <div>
        <ui-h2>Payments</ui-h2>
        <div>
            <TransactionsTable
                :transactions="transactions"
                :get-transaction-route="getTransactionRoute"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { apiClient } from "../../../api-client";
import { showError } from "../../../toasts";
import TransactionsTable from "../../../components/transactions-table.vue";
import type { ITransaction } from '../../../services';

const transactions = ref<ITransaction[]>([]);
onMounted(async () => {
    try {
        transactions.value = await apiClient.getAllTransactions();
    }
    catch (e: any) {
        showError(e.message);
    }
});

function getTransactionRoute(trx: ITransaction) {
    return { name: 'admin-payment-details', params: { id: trx._id } };
}
</script>
