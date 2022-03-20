<template>
    <UiTable>
        <UiTHead>
            <UiTR>
                <UiTH>Transaction ID</UiTH>
                <UiTH>Amount</UiTH>
                <UiTH v-if="isAdmin">Paid By</UiTH>
                <UiTH>Provider</UiTH>
                <UiTH>Provider Reference</UiTH>
                <UiTH>Status</UiTH>
                <UiTH>Date</UiTH>
            </UiTR>
        </UiTHead>
        <UiTBody>
            <UiTR v-for="trx in transactions" :key="trx._id">
                <UiTD><UiLink :to="getTransactionRoute(trx)">{{ trx._id }}</UiLink></UiTD>
                <UiTD>{{ trx.amount }}</UiTD>
                <UiTD v-if="isAdmin"><UserLink :user="trx.fromUserData" /></UiTD>
                <UiTD>{{ getPaymentProviderDisplayName(trx.provider) }}</UiTD>
                <UiTD>{{ trx.providerTransactionId }}</UiTD>
                <UiTD>{{ trx.status }}</UiTD>
                <UiTD>{{ getDateTimeString(getTransactionDate(trx)) }}</UiTD>
            </UiTR>
        </UiTBody>
    </UiTable>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useUser } from "../store";
import {
    isUserAdmin,
    getTransactionDate,
    getDateTimeString,
    getPaymentProviderDisplayName
    } from "../services";
import type { ITransaction } from "../services";
import {
    UiTable,
    UiTHead,
    UiTBody,
    UiTH,
    UiTD,
    UiTR,
    UiLink
} from "../ui-components";
import UserLink from "./user-link.vue";

defineProps<{
    transactions: ITransaction[],
    getTransactionRoute: (trx: ITransaction) => { name: string, params: any }
}>();

const userStore = useUser();
const isAdmin = computed(() => userStore.user.value ?
    isUserAdmin(userStore.user.value) : false)
</script>
