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
                    <UiSelect label="Status" v-model="user.status" disabled>
                        <UiSelectOption label="Active" value="active" />
                        <UiSelectOption label="Disabled" value="disabled" />
                    </UiSelect>
                    <UiNumberInput label="Arrears" :modelValue="arrears" disabled  />
                </UiGridLayout>
                <UiH3>Roles</UiH3>
                <UiLayout smallGap>
                    <UiText v-for="role in user.roles" :key="role" bold>{{ getRoleDisplayName(role) }}</UiText>
                </UiLayout>
                <UiLayout smallGap>
                    <UiButton v-if="!isUserAdmin(user)" @click="openMakeAdminDialog">Promote to admin</UiButton>
                    <UiRouterButton :to="{ name: 'admin-members' }" secondary>Go Back</UiRouterButton>
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
            <TransactionsTable :transactions="transactions" :getTransactionRoute="getTransactionRoute"/>
        </UiLayout>
        <UiDialog ref="makeAdminDialog" v-if="user" title="Promote user to admin">
            <UiLayout vertical smallGap>
                <UiTextBlock>
                    Are you sure you want to promote
                    <UiText block>{{ user.name }}</UiText>
                    to administrator?
                </UiTextBlock>
                <UiLayout smallGap>
                    <UiButton @click="makeAdmin">Promote to admin</UiButton>
                    <UiButton secondary @click="cancelMakeAdmin">Cancel</UiButton>
                </UiLayout>
            </UiLayout>
        </UiDialog>
    </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { showError, showSuccess } from "../../../toasts";
import { getRoleDisplayName, isUserAdmin, ITransaction } from "../../../services";
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
    UiDialog,
    UiText,
    UiTextBlock,
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
        UiDialog,
        UiText,
        UiTextBlock,
        UiTextInput,
        UiNumberInput,
        UiDateInput,
        UiSelect,
        UiSelectOption,
        UiGridLayout },
    setup() {
        const user = ref();
        const transactions = ref<ITransaction[]>([]);
        const isAddPaymentPaneOpen = ref(false);
        const addPaymentPane = ref();
        const makeAdminDialog = ref<typeof UiDialog>();

        onMounted(async () => {
            const route = useRoute();
            const userId = route.params.id as string;
            try {
                user.value = await apiClient.getUserById(userId);
                transactions.value = await apiClient.getUserTransactions(userId);
            }
            catch (e: any) {
                showError(e.message);
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

        function getTransactionRoute(trx: ITransaction) {
            return { name: 'admin-payment-details', params: { id: trx._id } };
        }

        function openAddPaymentPane() {
            isAddPaymentPaneOpen.value = true;
        }
        
        function closeAddPaymentPane() {
            isAddPaymentPaneOpen.value = false;
        }

        function onAddPayment(trx: ITransaction) {
            transactions.value?.unshift(trx);
            closeAddPaymentPane();
        }

        function openMakeAdminDialog() {
            makeAdminDialog.value?.open();
        }

        async function makeAdmin() {
            try {
                user.value = await apiClient.makeUserAdmin(user.value._id);
                makeAdminDialog.value?.close();
                showSuccess(`Successfully promoted ${user.value.name} to admin.`);
            }
            catch (e: any) {
                showError(e.message);
            }
        }

        function cancelMakeAdmin() {
            makeAdminDialog.value?.close();
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
            onAddPayment,
            isUserAdmin,
            getRoleDisplayName,
            makeAdminDialog,
            openMakeAdminDialog,
            cancelMakeAdmin,
            makeAdmin,
            getTransactionRoute
        }
    },
})
</script>
