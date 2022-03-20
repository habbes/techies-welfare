<template>
    <UiLayout vertical>
        <UiH2>{{ title }}</UiH2>
        <PaymentDetailsCard v-if="transaction" :transaction="transaction" />
    </UiLayout>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '../../api-client';
// TODO: import type is a workaround for this issue: https://github.com/vuejs/core/issues/3183
// may be fixed in a later version, revisit this after upgrading vue.js
import type { ITransaction } from '../../services';
import { getPaymentProviderDisplayName } from "../../services";
import { showError } from '../../toasts';
import {
    UiLayout,
    UiH2
} from "../../ui-components";
import PaymentDetailsCard from "../../components/payment-details-card.vue";

const transaction = ref<ITransaction>();
const route = useRoute();

const providerName = computed(() =>
    transaction.value ?
        getPaymentProviderDisplayName(transaction.value.provider) : null);

const title = computed(() =>
    transaction.value ?
        `${providerName.value} transaction: ${transaction.value.providerTransactionId}`
        : '');

onMounted(async () => {
    try {
        const txId = route.params.id as string;
        transaction.value = await apiClient.getMyTransactionById(txId);
    }
    catch (e: any) {
        showError(e.message);
    }
});
</script>
