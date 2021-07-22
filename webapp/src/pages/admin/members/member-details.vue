<template>
    <div>
        <div class="flex gap-3">
            <router-link :to="{ name: 'admin-members' }">&lt;</router-link> <ui-h2>{{ user?.name }}</ui-h2>
        </div>
        <div v-if="user" class="mb-3">
            <ui-card>
                <div class="flex justify-between">
                    <div>
                        <div class="mb-3">
                            <div class="font-bold">Name</div>
                            {{ user.name }}
                        </div>
                        <div class="mb-3">
                            <div class="font-bold">Team</div>
                            {{ user.team }}
                        </div>
                        <div class="mb-3">
                            <div class="font-bold">Member Since</div>
                            {{ new Date(user.joinedAt || user.createdAt).toLocaleDateString() }}
                        </div>
                    </div>
                    <div>
                        <div class="mb-3">
                            <div class="font-bold">Phone</div>
                            {{ user.phone }}
                        </div>
                        <div class="mb-3">
                            <div class="font-bold">Email</div>
                            {{ user.email }}
                        </div>
                    </div>
                    <div>
                        <div class="mb-3">
                            <div class="font-bold">Total Contributions</div>
                            Ksh {{ totalContribution }}
                        </div>
                        <div class="mb-3">
                            <div class="font-bold">Arrears</div>
                            Ksh {{ arrears }}
                        </div>
                    </div>
                </div>
            </ui-card>
        </div>
        <div v-if="transactions.length" class="mt-5">
            <ui-h3>Transactions</ui-h3>
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
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from "../../../api-client";

const MONTHLY_CONTRIBUTION = 1000;

export default defineComponent({
    setup() {
        const user = ref();
        const transactions = ref([]);

        onMounted(async () => {
            const route = useRoute();
            const userId = route.params.id as string;
            try {
                user.value = await apiClient.getUserById(userId);
                transactions.value = await apiClient.getUserTransactions(userId);
            }
            catch (e) {
                alert(e.message);
            }
        });

        const totalContribution = computed(() => {
            return transactions.value
            .filter(t => t.status === "success")
            .reduce((sum, t) => sum + t.amount, 0);
        });

        const arrears = computed(() => {
            if (!user.value) return 0;

            const now = new Date();
            const joinedAt = new Date(user.value.joinedAt || user.value.createdAt);
            const yearDiff = now.getFullYear() - joinedAt.getFullYear();
            const monthDiff = (yearDiff * 12) + (now.getMonth() - joinedAt.getMonth());
            const expectedContribution = monthDiff * MONTHLY_CONTRIBUTION;
            const arrears = expectedContribution - totalContribution.value;
            
            return arrears;
        });

        return {
            user,
            transactions,
            totalContribution,
            arrears
        }
    },
})
</script>
