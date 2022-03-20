<template>
    <UiCard>
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

            <UiLayout v-if="isAdmin" vertical tinyGap>
                <UiText bold>Paid by</UiText>
                <UserLink :user="transaction.fromUserData"/>
            </UiLayout>

            <UiLayout vertical tinyGap v-if="transactionDate">
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

            <UiLayout v-if="isAdmin && transaction.provider === 'manual_entry' && recordedBy" vertical tinyGap>
                <UiText bold>Recorded by</UiText>
                <UserLink :user="recordedBy" />
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
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { apiClient } from '../api-client';
// TODO: import type is a workaround for this issue: https://github.com/vuejs/core/issues/3183
// may be fixed in a later version, revisit this after upgrading vue.js
import type { ITransaction, IUser } from '../services';
import {
    isUserAdmin,
    getTransactionDate,
    getDateTimeString,
    getPaymentProviderDisplayName
} from "../services";
import { showError } from '../toasts';
import { useUser } from "../store";
import {
    UiLayout,
    UiCard,
    UiText,
} from "../ui-components";
import UserLink from "./user-link.vue";

// const transaction = ref<ITransaction>();
const recordedBy = ref<IUser>();
const user = useUser().user;

const props = defineProps<{
    transaction: ITransaction
}>();

const providerName = computed(() =>
    getPaymentProviderDisplayName(props.transaction.provider));

const transactionDate = computed(() =>
    getTransactionDate(props.transaction));

const isAdmin = computed(() => user.value && isUserAdmin(user.value));

onMounted(async () => {
    try {
        if (isAdmin.value && props.transaction.provider === 'manual_entry') {
            recordedBy.value = await apiClient
                .getUserById(props.transaction.metadata.recordedBy._id);
        }
    }
    catch (e: any) {
        showError(e.message);
    }
});
</script>
