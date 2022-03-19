<template>
    <div class="min-h-screen flex flex-col">
        <NavBar :user="user"/>
        <main class="flex-1 flex flex-col">
            <router-view></router-view>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { UiChevronDownIcon, UiDropdown, UiDropdownItem } from "../../ui-components";
import NavBar from "../../components/navbar.vue";
import { authService } from "../../auth";
import { useUser } from "../../store";
import { showError } from "../../toasts";
import { apiClient } from '../../api-client';

export default defineComponent({
    components: { NavBar, UiChevronDownIcon, UiDropdown, UiDropdownItem },
    setup() {
        const user = useUser().user;

        onMounted(async () => {
            if (!authService.isAuthenticated()) {
                try {
                    await authService.login();
                }
                catch (err) {
                    showError(err.message);
                }
            }
            else {
                try {
                    const user = await apiClient.getLoggedInUser();
                    const accountSummary = await apiClient.getMyAccountSummary();
                    const userStore = useUser();
                    userStore.setUser(user);
                    userStore.updateAccountSummary(accountSummary);
                }
                catch (e) {
                    showError(e.message);
                }
            }
        });

        return {
            user
        };
    },
})
</script>
