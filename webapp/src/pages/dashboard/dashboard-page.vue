<template>
    <div class="min-h-screen flex flex-col">
        <NavBar :user="user" :logout="logout"/>
        <main class="flex-1 flex flex-col">
            <router-view></router-view>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { UiChevronDownIcon, UiDropdown, UiDropdownItem } from "../../ui-components";
import NavBar from "../../components/navbar.vue";
import { authService } from "../../auth";
import { useUser, clearSession } from "../../store";
import { apiClient } from '../../api-client';

export default defineComponent({
    components: { NavBar, UiChevronDownIcon, UiDropdown, UiDropdownItem },
    setup() {
        const router = useRouter();
        const user = useUser().user;

        onMounted(async () => {
            if (!authService.isAuthenticated()) {
                console.log("loggin in");
                try {
                    await authService.login();
                    console.log("Login success");
                }
                catch (err) {
                    console.error("Login error", err);
                }
            }
            else {
                const token = await authService.getAccessToken();
                const user = await apiClient.getLoggedInUser();
                useUser().setUser(user);
                console.log('token', token, 'user', user);
            }
        });
        
        async function logout() {
            await authService.logout();
            clearSession();
            router.push({ name: "login" });
        }

        return {
            logout,
            user
        };
    },
})
</script>
