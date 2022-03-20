<template>
    <UiTable>
        <UiTHead>
            <UiTR>
                <UiTH>Transaction ID</UiTH>
                <UiTH>Amount</UiTH>
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
                <UiTD>{{ trx.provider }}</UiTD>
                <UiTD>{{ trx.providerTransactionId }}</UiTD>
                <UiTD>{{ trx.status }}</UiTD>
                <UiTD>{{ trx.createdAt }}</UiTD>
            </UiTR>
        </UiTBody>
    </UiTable>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ITransaction } from "../services";
import { UiTable, UiTHead, UiTBody, UiTH, UiTD, UiTR, UiLink } from "../ui-components";

export default defineComponent({
    components: { UiTable, UiTHead, UiTBody, UiTH, UiTD, UiTR, UiLink },
    props: {
        transactions: {
            type: Array as PropType<ITransaction[]>,
            required: true
        },
        getTransactionRoute: {
            type: Function as PropType<(trx: ITransaction) => { name: string, params: any }>,
            required: true
        }
    },
    setup() {
        
    },
})
</script>
