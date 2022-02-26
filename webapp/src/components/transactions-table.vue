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
                <UiTD>{{ trx._id }}</UiTD>
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
import { defineComponent } from 'vue';
import { UiTable, UiTHead, UiTBody, UiTH, UiTD, UiTR } from "../ui-components";

export default defineComponent({
    components: { UiTable, UiTHead, UiTBody, UiTH, UiTD, UiTR },
    props: {
        transactions: Array
    },
    setup() {
        
    },
})
</script>
