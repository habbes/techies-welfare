<template>
    <ui-table>
        <ui-thead>
            <ui-tr>
                <ui-th>Transaction ID</ui-th>
                <ui-th>Amount</ui-th>
                <ui-th>Provider</ui-th>
                <ui-th>Provider Reference</ui-th>
                <ui-th>Status</ui-th>
                <ui-th>Date</ui-th>
            </ui-tr>
        </ui-thead>
        <ui-tbody>
            <ui-tr v-for="trx in transactions" :key="trx._id">
                <ui-td>{{ trx._id }}</ui-td>
                <ui-td>{{ trx.amount }}</ui-td>
                <ui-td>{{ trx.provider }}</ui-td>
                <ui-td>{{ trx.providerTransactionId }}</ui-td>
                <ui-td>{{ trx.status }}</ui-td>
                <ui-td>{{ trx.createdAt }}</ui-td>
            </ui-tr>
        </ui-tbody>
    </ui-table>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        transactions: Array
    },
    setup() {
        
    },
})
</script>
