<template>
    <div>
        <div class="flex gap-3">
            <router-link :to="{ name: 'admin-members' }"></router-link> <UiH2>Add Member</UiH2>
        </div>
        <UiCard>
            <form @submit.prevent="openDialog" class="w-full">
                <UiH3>Member Info</UiH3>
                <UiGridLayout :cols="3" :gap="3">
                    <UiTextInput
                        v-model="name"
                        label="Name*"
                        full
                        required
                        class="mb-3"/>
                    <UiTextInput
                        v-model="email"
                        label="Email*"
                        type="email"
                        full required
                        class="mb-3" />
                    <UiTextInput
                        v-model="phone"
                        label="Phone*"
                        type="tel"
                        placeholder="2547xxxxxxxx"
                        full
                        required
                        class="mb-3" />
                    <UiTextInput
                        v-model="idNumber"
                        label="ID Number"
                        type="text"
                        full
                        class="mb-3" />
                    <UiTextInput
                        v-model="team"
                        label="Team"
                        full
                        class="mb-3"/>
                    <UiTextInput
                        v-model="memberSince"
                        label="Member Since*"
                        type="date"
                        full
                        required
                        class="mb-3" />
                    <UiTextInput
                        v-model="status"
                        label="Status*"
                        full
                        required
                        class="mb-3"/>
                </UiGridLayout>

                <UiH3>Next of kin details</UiH3>

                <UiGridLayout :cols="3" :gap="3" class="mb-3">
                    <UiTextInput
                        v-model="nextOfKin.name"
                        label="Next of kin name"
                        full/>
                    <UiTextInput
                        v-model="nextOfKin.email"
                        label="Email address"
                        full/>
                    <UiTextInput
                        v-model="nextOfKin.phone"
                        label="Phone number"
                        type="tel"
                        full/>
                    <UiTextInput
                        v-model="nextOfKin.relationship"
                        label="Relationship"
                        full/>
                </UiGridLayout>

                <UiLayout class="gap-3">
                    <UiButton submit>Save</UiButton>
                    <UiButton secondary @click="cancel">Cancel</UiButton>
                </UiLayout>
            </form>
        </UiCard>
        <UiDialog ref="dialog" title="Confirm new member details">
            <div>
                <div>Name: <span class="font-mono font-semibold">{{ name }}</span></div>
                <div>Phone: <span class="font-mono font-semibold">{{ phone }}</span></div>
                <div>Email: <span class="font-mono font-semibold">{{ email }}</span></div>
                <div>Status: <span class="font-mono font-semibold">{{ status }}</span></div>
                <div>Team: <span class="font-mono font-semibold">{{ team }}</span></div>
                <div>ID Number: <span class="font-mono font-semibold">{{ idNumber }}</span></div>
                <div>Member Since: <span class="font-mono font-semibold">{{ new Date(memberSince).toLocaleDateString() }}</span></div>
                <div>Next of Kin:
                    <span class="font-mono font-semibold">{{ nextOfKin.name }}</span>,
                    <span class="font-mono font-semibold">{{ nextOfKin.email }}</span>,
                    <span class="font-mono font-semibold">{{ nextOfKin.phone }}</span>,
                    <span class="font-mono font-semibold">{{ nextOfKin.relationship }}</span>
                </div>
            </div>
            <UiLayout class="mt-3 gap-3">
                <UiButton @click="registerUser" primary>Proceed to register member</UiButton>
                <UiButton @click="closeDialog" secondary>Cancel</UiButton>
            </UiLayout>
        </UiDialog>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from "vue-router";
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
        const name = ref('');
        const phone = ref('');
        const email = ref('');
        const idNumber = ref('');
        const team = ref('');
        const status = ref('active');
        const memberSince = ref(getDefaultDateString());
        const nextOfKin = reactive({
            name: '',
            phone: '',
            email: '',
            relationship: ''
        });

        const dialog = ref();

        const router = useRouter();

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
            idNumber.value = '';
            status.value = 'active';
            nextOfKin.name = '';
            nextOfKin.phone = '';
            nextOfKin.email = '';
            nextOfKin.relationship = '';
            memberSince.value = getDefaultDateString();
        }

        function getDefaultDateString() {
            return new Date().toISOString().split("T")[0];
        }

        function cancel() {
            resetForm();
            router.push({ name: 'admin-members' });
        }

        async function registerUser() {
            const args = {
                name: name.value,
                phone: phone.value,
                email: email.value,
                team: team.value,
                joinedAt: new Date(memberSince.value)
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
            memberSince,
            idNumber,
            nextOfKin,
            openDialog,
            closeDialog,
            registerUser,
            cancel
        };
    },
})
</script>
