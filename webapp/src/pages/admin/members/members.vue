<template>
    <div>
        <UiLayout justify="between">
            <UiLayout>
                <UiH2>Members</UiH2>
                <div class="ml-10 w-72">
                    <UiTextInput full placeholder="Search..." v-model="searchTerm"></UiTextInput>
                </div>
            </UiLayout>
            <div class="">
                <UiRouterButton :to="{ name: 'admin-add-member' }">Add new member</UiRouterButton>
            </div>
            
        </UiLayout>
        <div class="">
            <UiTable>
                <UiTHead>
                    <UiTR>
                        <UiTH>Name</UiTH>
                        <UiTH>Phone</UiTH>
                        <UiTH>Email</UiTH>
                        <UiTH>Team</UiTH>
                        <UiTH>Status</UiTH>
                        <UiTH>Member Since</UiTH>
                    </UiTR>
                </UiTHead>
                <UiTBody>
                    <UiTR v-for="user in filteredUsers" :key="user._id">
                        <UiTD>
                            <UiLink :to="{ name: 'admin-member-details', params: { id: user._id }}">{{ user.name }}</UiLink>
                        </UiTD>
                        <UiTD>{{ user.phone }}</UiTD>
                        <UiTD>{{ user.email }}</UiTD>
                        <UiTD>{{ user.team }}</UiTD>
                        <UiTD>Status</UiTD>
                        <UiTD>{{ new Date(user.joinedAt||user.createdAt).toDateString() }}</UiTD>
                    </UiTR>
                </UiTBody>
            </UiTable>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { apiClient } from "../../../api-client";
import { UiLayout, UiText, UiH2, UiLink, UiTextInput, UiRouterButton, UiTable, UiTH, UiTHead, UiTD, UiTR, UiTBody } from "../../../ui-components";

export default defineComponent({
    components: {
        UiLayout,
        UiH2,
        UiRouterButton,
        UiTextInput,
        UiTable,
        UiTH,
        UiTD,
        UiTR,
        UiTHead,
        UiTBody,
        UiText,
        UiLink
    },
    setup() {
        const initialUsers = [
            { name: 'Clement', email: 'clhabins@microsoft.com', phone: '254711222333', team: 'FAST', status: 'status', createdAt: new Date() },
            { name: 'Clement', email: 'clhabins@microsoft.com', phone: '254711222333', team: 'FAST', status: 'status', createdAt: new Date() }
        ]
        const users = ref([...initialUsers]);
        const searchTerm = ref('');

        onMounted(async() => {
            users.value = await apiClient.getAllUsers();
        });

        const filteredUsers = computed(() => {
            if (!searchTerm.value) {
                return users.value;
            }

            if (!users.value)  {
                return [];
            }

            const regex = new RegExp(searchTerm.value, "i");
            return users.value.filter(
                user => regex.test(user.name) || regex.test(user.email) || regex.test(user.phone || regex.test(user.team)));

        })

        return {
            users,
            searchTerm,
            filteredUsers
        };
    },
})
</script>
