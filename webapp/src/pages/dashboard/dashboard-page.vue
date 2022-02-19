<template>
    <div class="min-h-screen flex flex-col">
        <NavBar :user="user" :logout="logout"/>
        <main class="flex-1 flex flex-col">
            <router-view></router-view>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from "vue-router";
import { UiChevronDownIcon, UiDropdown, UiDropdownItem } from "../../ui-components";
import NavBar from "../../components/navbar.vue";
import { authService } from "../../auth";
import { useUser, clearSession } from "../../store";

export default defineComponent({
    components: { NavBar, UiChevronDownIcon, UiDropdown, UiDropdownItem },
    setup() {
        const router = useRouter();
        const user = useUser().user;
        
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
