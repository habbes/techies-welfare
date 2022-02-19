<template>
    <div>
        <div class="flex gap-3">
            <router-link :to="{ name: 'admin-members' }"></router-link> <ui-h2>Add Member</ui-h2>
        </div>
        <UiCard>
            <form @submit.prevent="openDialog" class="w-full">
                <UiH3>Member Info</UiH3>
                <UiGridLayout :cols="3" :gap="3">
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
                        label="ID Number"
                        type="text"
                        full
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
                        class="mb-3"/>
                    <ui-text-input
                        v-model="joinedAt"
                        label="Date Joined"
                        type="date"
                        full
                        required
                        class="mb-3" />
                    <ui-text-input
                        v-model="status"
                        label="Status"
                        full
                        class="mb-3"/>
                </UiGridLayout>

                <UiH3>Next of kin details</UiH3>

                <UiGridLayout :cols="3" :gap="3" class="mb-3">
                    <UiTextInput
                        label="Next of kin name"
                        full/>
                    <UiTextInput
                        label="Email address"
                        full/>
                    <UiTextInput
                        label="Phone number"
                        full/>
                    <UiTextInput
                        label="Relationship"
                        full/>
                </UiGridLayout>

                <UiLayout class="gap-3">
                    <ui-button submit>Save</ui-button>
                    <ui-button secondary>Cancel</ui-button>
                </UiLayout>
            </form>
        </UiCard>
        <ui-dialog ref="dialog" title="Confirm new member details">
            <div>
                <div>Name: <span class="font-mono font-semibold">{{ name }}</span></div>
                <div>Phone: <span class="font-mono font-semibold">{{ phone }}</span></div>
                <div>Email: <span class="font-mono font-semibold">{{ email }}</span></div>
                <div>Email: <span class="font-mono font-semibold">{{ team }}</span></div>
                <div>Date Joined: <span class="font-mono font-semibold">{{ new Date(joinedAt).toLocaleDateString() }}</span></div>
            </div>
            <UiLayout class="mt-3 gap-3">
                <UiButton @click="registerUser" primary>Proceed to register member</UiButton>
                <UiButton @click="closeDialog" secondary>Cancel</UiButton>
            </UiLayout>
        </ui-dialog>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { apiClient } from "../../../api-client";
import { UiButton, UiGridLayout, UiLayout, UiDialog, UiTextInput, UiH2, UiH3, UiCard } from "../../../ui-components";


export default defineComponent({
    components: {
        UiButton,
        UiLayout,
        UiGridLayout,
        UiDialog,
        UiTextInput,
        UiH2,
        UiH3,
        UiCard
    },
    setup() {
        const name = ref('f');
        const phone = ref('2');
        const email = ref('s@s.com');
        const team = ref('');
        const status = ref('');
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
            status,
            joinedAt,
            openDialog,
            closeDialog,
            registerUser
        };
    },
})
</script>
