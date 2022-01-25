<template>
    <div class="min-h-screen flex flex-col">
        <nav class="flex justify-between items-center bg-white shadow-sm h-14 px-4">
            <div class="flex gap-3">
                <router-link to="/"><img src="/img/logo.png" alt="Logo" style="width:100px" /></router-link>
            </div>
            <div class="flex gap-3">
                <UiDropdown v-if="user">
                    <template #activator>
                        <div class="flex items-center">
                            <div class="flex-col mr-3">
                                <div class="text-base">{{ user.name }}</div>
                                <div class="text-sm text-secondary-light">{{ user.roles[0] }}</div>
                            </div>
                            <span class="text-secondary-light"><ui-chevron-down-icon class="cursor-pointer" width="18" height="18"/></span>
                        </div>
                    </template>
                    <UiDropdownItem>
                        My account
                    </UiDropdownItem>
                    <UiDropdownItem :route="{ name: 'admin' }">
                        Admin dashboard
                    </UiDropdownItem>
                    <UiDropdownItem @click="logout">
                        Sign out
                    </UiDropdownItem>
                </UiDropdown>
            </div>
        </nav>
        <main class="flex-1 flex flex-col">
            <router-view></router-view>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from "vue-router";
import { UiChevronDownIcon, UiDropdown, UiDropdownItem } from "../../ui-components";
import { authService } from "../../auth";
import { useUser, clearSession } from "../../store";

export default defineComponent({
    components: { UiChevronDownIcon, UiDropdown, UiDropdownItem },
    setup() {
        const router = useRouter();
        const user = useUser().user;
        
        async function logout() {
            await authService.logout();
            clearSession();
            router.push({ name: "dashboard" });
        }

        return {
            logout,
            user
        };
    },
})
</script>
