<template>
    <ui-card class="w-1/3 mx-auto mt-14">
        <p v-if="verifying">
            Verifying transaction. Please wait...
        </p>
        <p v-if="cancelled">
            Transaction was cancelled.
        </p>
        <p v-if="transaction && transaction.status === 'pending'">
            Transaction is still pending. Refresh the page after a few minutes to check again...
        </p>
        <p v-if="transaction && transaction.status === 'failed'" class="text-red-400">
            Transaction failed: {{ transaction.failureReason }}
        </p>
        <p v-if="transaction && transaction.status === 'success'" class="text-green-400">
            Success: Ksh {{ transaction.amount }} was successffully received.
        </p>
    </ui-card>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from "vue-router";
import { apiClient } from "../../api-client";

export default defineComponent({
    setup() {
        const verifying = ref(true);
        const transaction = ref({});
        const cancelled = ref(false);

        onMounted(async () => {
            const txId = getTxRef();
            if (txId) {
                try {
                    transaction.value = await apiClient.getTransactionByProviderId('flutterwave', txId);
                }
                catch (e) {
                    alert(e.message);
                }
                verifying.value = false;
            }
        });

        function getTxRef() {
            const query = useRoute().query;
            if (query.status === 'cancelled') {
                cancelled.value = true;
            }

            if (query.tx_ref) {
                return query.tx_ref;
            }

            if (query.resp) {
                try {
                const response = JSON.parse(query.resp as string);
                const txRef = response?.tx?.txRef;
                return txRef;
                }
                catch (e) {} // eslint-disable-line no-empty
            }
        }

        return {
            transaction,
            verifying,
            cancelled
        }
    },
})
</script>
