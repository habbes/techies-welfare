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
            <table class="border-t border-gray-100">
                <thead>
                    <th class="first:pl-5 last:pr-5 py-2">Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Member Since</th>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user._id" class="first:pl-5 last:pr-5 py-5 border-t border-gray-100">
                        <td class="px-2 rounded-md min-w- bg-white mr-5 text-sm text-gray-700">{{ user.name }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.team }}</td>
                        <td>{{ new Date(user.joinedAt||user.createdAt).toDateString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { apiClient } from "../../api-client";

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
