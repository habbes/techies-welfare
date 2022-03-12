<template>
    <UiLayout vertical>
        <UiH2>{{ user?.name }}</UiH2>
        <UiCard v-if="user">
            <UiLayout vertical smallGap>
                <UiGridLayout :cols="4" :gap="3">
                    <UiTextInput label="Name" v-model="user.name" disabled />
                    <UiTextInput label="Phone number" v-model="user.name" disabled />
                    <UiDateInput label="Member since" :modelValue="memberSince" disabled />
                    <UiNumberInput label="Total contribution" :modelValue="totalContribution" disabled />
                    <UiTextInput label="Email address" type="email" v-model="user.email" disabled />
                    <UiTextInput label="Team" v-model="user.team" disabled />
                    <UiSelect label="Status" v-model="user.status">
                        <UiSelectOption label="Active" value="active" />
                        <UiSelectOption label="Disabled" value="disabled" />
                    </UiSelect>
                    <UiNumberInput label="Arrears" :modelValue="arrears" disabled  />
                </UiGridLayout>
                <UiLayout smallGap>
                    <UiButton>Save changes</UiButton>
                    <UiButton secondary>Cancel</UiButton>
                </UiLayout>
            </UiLayout>
        </UiCard>
        <AddPayment
            v-if="user"
            :user="user"
            class="mt-5"
            v-show="isAddPaymentPaneOpen"
            @cancel="closeAddPaymentPane"
            @addPayment="onAddPayment"/>
        <UiLayout vertical class="mt-5" v-show="!isAddPaymentPaneOpen">
            <UiLayout justify="between" align="center">
                <UiH3>Payments</UiH3>
                <UiButton class="mb-5" @click="openAddPaymentPane">Add payment</UiButton>
            </UiLayout>
            <TransactionsTable :transactions="transactions" />
        </UiLayout>
    </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from "../../../api-client";
import AddPayment from "./add-payment.vue";
import TransactionsTable from "../../../components/transactions-table.vue";
import {
    UiLayout,
    UiH2,
    UiH3,
    UiButton,
    UiRouterButton,
    UiCard,
    UiText,
    UiTextInput,
    UiDateInput,
    UiSelect,
    UiSelectOption,
    UiNumberInput,
    UiGridLayout } from "../../../ui-components";

const MONTHLY_CONTRIBUTION = 1000;

export default defineComponent({
    components: {
        AddPayment,
        TransactionsTable,
        UiH2,
        UiH3,
        UiLayout,
        UiButton,
        UiRouterButton,
        UiCard,
        UiText,
        UiTextInput,
        UiNumberInput,
        UiDateInput,
        UiSelect,
        UiSelectOption,
        UiGridLayout },
    setup() {
        const user = ref();
        const transactions = ref([]);
        const isAddPaymentPaneOpen = ref(false);
        const addPaymentPane = ref();

        onMounted(async () => {
            const route = useRoute();
            const userId = route.params.id as string;
            try {
                user.value = await apiClient.getUserById(userId);
                console.log('user retrieved', user);
                transactions.value = await apiClient.getUserTransactions(userId);
            }
            catch (e) {
                alert(e.message);
            }
        });

        const totalContribution = computed<number>(() => {
            return transactions.value
            .filter(t => t.status === "success")
            .reduce((sum, t) => sum + t.amount, 0);
        });

        const memberSince = computed(() => {
            return new Date(user.value.joinedAt || user.value.createdAt);
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

        function openAddPaymentPane() {
            isAddPaymentPaneOpen.value = true;
        }
        
        function closeAddPaymentPane() {
            isAddPaymentPaneOpen.value = false;
        }

        function onAddPayment(trx) {
            transactions.value?.unshift(trx);
            closeAddPaymentPane();
        }

        return {
            user,
            transactions,
            totalContribution,
            memberSince,
            arrears,
            addPaymentPane,
            isAddPaymentPaneOpen,
            openAddPaymentPane,
            closeAddPaymentPane,
            onAddPayment
        }
    },
})
</script>
