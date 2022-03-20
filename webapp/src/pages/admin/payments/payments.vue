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
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { apiClient } from "../../../api-client";
import { showError } from "../../../toasts";
import TransactionsTable from "../../../components/transactions-table.vue";
import { ITransaction } from '../../../services';

export default defineComponent({
    components: { TransactionsTable },
    setup() {
        const transactions = ref([]);
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

        return {
            transactions,
            getTransactionRoute
        };
    },
})
</script>
