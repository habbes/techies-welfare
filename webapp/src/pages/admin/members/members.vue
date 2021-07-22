<template>
    <div>
        <ui-h2>Members</ui-h2>
        <div class="mb-3">
            <ui-router-button :to="{ name: 'admin-add-member' }">Add new member</ui-router-button>
        </div>
        <div class="mb-3">
            <ui-text-input full placeholder="Search..." v-model="searchTerm"></ui-text-input>
        </div>
        <div class="bg-white">
            <ui-table>
                <ui-thead>
                    <ui-th>Name</ui-th>
                    <ui-th>Phone</ui-th>
                    <ui-th>Email</ui-th>
                    <ui-th>Team</ui-th>
                    <ui-th>Member Since</ui-th>
                </ui-thead>
                <ui-tbody>
                    <ui-tr v-for="user in filteredUsers" :key="user._id">
                        <ui-td><router-link :to="{ name: 'admin-member-details', params: { id: user._id }}">{{ user.name }}</router-link></ui-td>
                        <ui-td>{{ user.phone }}</ui-td>
                        <ui-td>{{ user.email }}</ui-td>
                        <ui-td>{{ user.team }}</ui-td>
                        <ui-td>{{ new Date(user.joinedAt||user.createdAt).toDateString() }}</ui-td>
                    </ui-tr>
                </ui-tbody>
            </ui-table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { apiClient } from "../../../api-client";

export default defineComponent({
    setup() {
        const users = ref([]);
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
