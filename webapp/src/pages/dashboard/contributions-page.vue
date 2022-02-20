<template>
    <div>
        <UiLayout justify="between">
            <UiLayout>
                <UiH2>My contributions</UiH2>
            </UiLayout>
            <div class="">
                <UiButton primary @click="openPaymentDialog">Make contribution</UiButton>
            </div>
        </UiLayout>
        <UiLayout>
            <TransactionsTable :transactions="transactions" />
        </UiLayout>
        <PaymentDialog ref="paymentDialog" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { apiClient } from "../../api-client";
import {
    UiLayout, UiText, UiH2, UiLink, UiTextInput, UiButton, UiTable, UiTH, UiTHead, UiTD, UiTR, UiTBody
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

        onMounted(async() => {
            transactions.value = await apiClient.getMyTransactions();
        });

        function openPaymentDialog() {
            paymentDialog.value?.open();
        }

        return {
            transactions,
            searchTerm,
            paymentDialog,
            openPaymentDialog
        };
    },
})
</script>
