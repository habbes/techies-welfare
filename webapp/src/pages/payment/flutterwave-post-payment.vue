<template>
    <UiCard class="w-1/3 mx-auto mt-14">
        <UiLayout vertical>
            <UiText v-if="verifying">
                Verifying transaction. Please wait...
            </UiText>
            <UiText v-else-if="cancelled">
                Transaction was cancelled.
            </UiText>
            <UiText v-else-if="transaction && transaction.status === 'pending'">
                Transaction is still <b>pending</b>. Refresh the page after a few minutes to check again...
            </UiText>
            <UiText v-else-if="transaction && transaction.status === 'failed'" danger>
                Transaction failed: {{ transaction.failureReason }}
            </UiText>
            <UiText v-else-if="transaction && transaction.status === 'success'" success>
                Success: Ksh {{ transaction.amount }} was successfully received.
            </UiText>

            <UiLayout class="mt-5">
                <UiRouterButton to="/" secondary>Back to home page.</UiRouterButton>
            </UiLayout>
        </UiLayout>
    </UiCard>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from "vue-router";
import { apiClient } from "../../api-client";
import { UiCard, UiRouterButton, UiLayout, UiText } from "../../ui-components";

export default defineComponent({
    components: { UiRouterButton, UiCard, UiLayout, UiText },
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
