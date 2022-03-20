<template>
    <UiLayout vertical>
        <UiH2>{{ title }}</UiH2>
        <UiCard v-if="transaction">
            <UiLayout vertical smallGap>
                <UiLayout vertical tinyGap>
                    <UiText bold>Internal transaction ID</UiText>
                    <UiText>{{ transaction._id }}</UiText>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Payment provider</UiText>
                    <UiText>{{ providerName }}</UiText>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Provider transaction ID</UiText>
                    <UiText>{{ transaction.providerTransactionId }}</UiText>
                </UiLayout>

                <UiLayout
                    v-if="transaction.provider === 'flutterwave' && transaction.status === 'success'"
                    vertical
                    tinyGap>
                    <UiText bold>Payment type</UiText>
                    <UiText>{{ transaction.metadata.payment_type }}</UiText>
                </UiLayout>

                <UiLayout
                    v-if="transaction.provider === 'flutterwave' && transaction.status === 'success'"
                    vertical
                    tinyGap>
                    <UiText bold>Flutterwave reference</UiText>
                    <UiText>{{ transaction.metadata.flw_ref }}</UiText>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Amount</UiText>
                    <UiText>{{ transaction.amount }}</UiText>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Paid by</UiText>
                    <UiLink :to="{ name: 'admin-member-details', params: { id: transaction.fromUser } }">
                        {{ transaction.fromUser }}
                    </UiLink>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Transaction date</UiText>
                    <UiText>{{ getDateTimeString(transactionDate) }}</UiText>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Status</UiText>
                    <UiText>{{ transaction.status }}</UiText>
                </UiLayout>

                <UiLayout v-if="transaction.status === 'failed'" vertical tinyGap>
                    <UiText bold>Failure reason</UiText>
                    <UiText>{{ transaction.failureReason }}</UiText>
                </UiLayout>

                <UiLayout vertical tinyGap>
                    <UiText bold>Last updated</UiText>
                    <UiText>{{ getDateTimeString(transaction.updatedAt) }}</UiText>
                </UiLayout>

                <UiLayout v-if="transaction.provider === 'manual_entry'" vertical tinyGap>
                    <UiText bold>Recorded by</UiText>
                    <UiLink :to="{ name: 'admin-member-details', params: { id: transaction.metadata.recordedBy._id } }">
                        {{ transaction.metadata.recordedBy._id }}
                    </UiLink>
                </UiLayout>

                <UiLayout v-if="transaction.provider === 'manual_entry'" vertical tinyGap>
                    <UiText bold>Recorded on</UiText>
                    <UiText>{{ getDateTimeString(transaction.createdAt) }}</UiText>
                </UiLayout>

                <UiLayout v-if="transaction.provider === 'manual_entry'" vertical tinyGap>
                    <UiText bold>Additional details</UiText>
                    <UiText>{{ transaction.metadata.details || 'N/A' }}</UiText>
                </UiLayout>
            </UiLayout>
        </UiCard>
    </UiLayout>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '../../../api-client';
// TODO: import type is a workaround for this issue: https://github.com/vuejs/core/issues/3183
// may be fixed in a later version, revisit this after upgrading vue.js
import type { ITransaction } from '../../../services';
import { getDateTimeString } from "../../../services";
import { showError } from '../../../toasts';
import {
    UiLayout,
    UiCard,
    UiH2,
    UiText,
    UiLink,
} from "../../../ui-components";

const transaction = ref<ITransaction>();
const route = useRoute();

const providerName = computed(() =>
    transaction.value?.provider === 'flutterwave' ? 'Flutterwave':
        transaction.value?.provider === "manual_entry" ? 'Manual Entry':
        transaction.value?.provider)

const title = computed(() =>
    transaction.value ?
        `${providerName.value} transaction: ${transaction.value.providerTransactionId}`
        : '');

const transactionDate = computed(() =>
    transaction.value?.provider === 'manual_entry' ?
        transaction.value?.metadata.transactionDate
        : transaction.value?.provider === 'flutterwave' && transaction.value?.status === 'success' ?
        transaction.value?.metadata.created_at
        : transaction.value?.createdAt);

onMounted(async () => {
    try {
        const txId = route.params.id as string;
        transaction.value = await apiClient.getTransactionById(txId);
    }
    catch (e: any) {
        showError(e.message);
    }
});

</script>
