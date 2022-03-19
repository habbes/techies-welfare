<template>
    <div>
        <ui-h2>Payments</ui-h2>
        <div>
            <TransactionsTable :transactions="transactions"/>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { apiClient } from "../../../api-client";
import { showError } from "../../../toasts";
import TransactionsTable from "../../../components/transactions-table.vue";

export default defineComponent({
    components: { TransactionsTable },
    setup() {
        const transactions = ref([]);
        onMounted(async () => {
            try {
                transactions.value = await apiClient.getAllTransactions();
            }
            catch (e) {
                showError(e.message);
            }
        });

        return {
            transactions
        };
    },
})
</script>
