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
            <TransactionsTable :transactions="transactions" />
        </UiLayout>
        <PaymentDialog ref="paymentDialog" />
    </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { apiClient } from "../../api-client";
import { useUser } from "../../store";
import { showError } from "../../toasts";
import {
    UiLayout, UiText, UiH2, UiLink,
    UiTextInput, UiButton, UiTable,
    UiTH, UiTHead, UiTD, UiTR, UiTBody
} from "../../ui-components";
import TransactionsTable from "../../components/transactions-table.vue";
import PaymentDialog from "../../components/payment-dialog.vue";

export default defineComponent({
    components: {
        UiLayout,
        UiH2,
        UiButton,
        UiTextInput,
        UiTable,
        UiTH,
        UiTD,
        UiTR,
        UiTHead,
        UiTBody,
        UiText,
        UiLink,
        TransactionsTable,
        PaymentDialog
    },
    setup() {
        const transactions = ref([]);
        const searchTerm = ref('');
        const paymentDialog = ref<typeof PaymentDialog>();
        const userStore = useUser();
        const user = userStore.user;
        const accountSummary = userStore.accountSummary;

        onMounted(async() => {
            try {
                transactions.value = await apiClient.getMyTransactions();
            }
            catch (e) {
                showError(e.message);
            }
        });

        function openPaymentDialog() {
            paymentDialog.value?.open();
        }

        return {
            transactions,
            searchTerm,
            paymentDialog,
            openPaymentDialog,
            user,
            accountSummary
        };
    },
})
</script>
