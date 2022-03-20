<template>
    <UiLayout vertical>
        <NavBar/>
        <UiCard class="w-1/3 mx-auto mt-14">
            <UiLayout vertical smallGap>
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

                <UiLayout smallGap>
                    <UiButton
                        primary
                        v-if="transaction && transaction.status === 'pending'"
                        @click="fetchTransaction">
                        Refresh
                    </UiButton>
                    <UiRouterButton to="/" secondary>Back to home page</UiRouterButton>
                </UiLayout>
            </UiLayout>
        </UiCard>
    </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from "vue-router";
import { apiClient } from "../../api-client";
import { useUser } from "../../store";
import { showError } from "../../toasts";
import {
    UiCard,
    UiButton,
    UiRouterButton,
    UiLayout,
    UiText
} from "../../ui-components";
import NavBar from "../../components/navbar.vue";

export default defineComponent({
    components: {
        UiButton,
        UiRouterButton,
        UiCard,
        UiLayout,
        UiText,
        NavBar
    },
    setup() {
        const verifying = ref(true);
        const transaction = ref<any>({});
        const cancelled = ref(false);
        const txId = ref<string>();

        onMounted(async () => {
            txId.value = getTxRef();
            await fetchTransaction();
        });

        async function fetchTransaction() {
            if (txId.value) {
                verifying.value = true;
                try {
                    transaction.value = await apiClient.getTransactionByProviderId('flutterwave', txId.value);
                    if (transaction.value.status === 'success') {
                        // refresh account summary if transaction is successful
                        // so arrears and total contribution counts can be updated
                        const userStore = useUser();
                        if (userStore.exists && userStore.user.value._id === transaction.fromUser) {
                            const summary =  await apiClient.getMyAccountSummary();
                            userStore.updateAccountSummary(summary);
                        }
                    }
                }
                catch (e) {
                    showError(e.message);
                }
                verifying.value = false;
            }
        }

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
            cancelled,
            fetchTransaction
        }
    },
})
</script>
