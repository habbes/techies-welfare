<template>
    <div>
        <div class="flex gap-3">
            <router-link :to="{ name: 'admin-members' }">&lt;</router-link> <ui-h2>Add Member</ui-h2>
        </div>
        <div>
            <form @submit.prevent="openDialog" class="w-1/2">
                <ui-text-input
                    v-model="name"
                    label="Name"
                    full
                    required
                    class="mb-3"/>
                <ui-text-input
                    v-model="email"
                    label="Email"
                    type="email"
                    full required
                    class="mb-3" />
                <ui-text-input
                    v-model="phone"
                    label="Phone"
                    type="tel"
                    placeholder="2547xxxxxxxx"
                    full required
                    class="mb-3" />
                <ui-text-input
                    v-model="team"
                    label="Team"
                    full
                    required
                    class="mb-3"/>
                <ui-text-input
                    v-model="joinedAt"
                    label="Date Joined"
                    type="date"
                    full
                    required
                    class="mb-3" />
                <ui-button submit>Register member</ui-button>
            </form>
        </div>
        <ui-dialog ref="dialog" title="Confirm new member details">
            <div>
                <div>Name: <span class="font-mono font-semibold">{{ name }}</span></div>
                <div>Phone: <span class="font-mono font-semibold">{{ phone }}</span></div>
                <div>Email: <span class="font-mono font-semibold">{{ email }}</span></div>
                <div>Email: <span class="font-mono font-semibold">{{ team }}</span></div>
                <div>Date Joined: <span class="font-mono font-semibold">{{ new Date(joinedAt).toLocaleDateString() }}</span></div>
            </div>
            <div class="mt-3 flex justify-end gap-3">
                <ui-button @click="registerUser">Proceed to register member</ui-button>
                <ui-button @click="closeDialog">Cancel</ui-button>
            </div>
        </ui-dialog>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { apiClient } from "../../api-client";

export default defineComponent({
    setup() {
        const name = ref('');
        const phone = ref('');
        const email = ref('');
        const team = ref('');
        const joinedAt = ref(getDefaultDateString());
        const dialog = ref();

        function openDialog() {
            dialog.value?.open();
        }

        function closeDialog() {
            dialog.value?.close();
        }

        function resetForm() {
            name.value = '';
            phone.value = '';
            email.value = '';
            team.value = '';
            joinedAt.value = getDefaultDateString()
        }

        function getDefaultDateString() {
            return new Date().toISOString().split("T")[0];
        }

        async function registerUser() {
            const args = {
                name: name.value,
                phone: phone.value,
                email: email.value,
                team: team.value,
                joinedAt: new Date(joinedAt.value)
            };

            try {
                const user = await apiClient.createUser(args);
                closeDialog();
                resetForm();
            }
            catch (e) {
                alert(`Error: ${e.message}`);
            }

        }

        return {
            dialog,
            name,
            phone,
            team,
            email,
            joinedAt,
            openDialog,
            closeDialog,
            registerUser
        };
    },
})
</script>
