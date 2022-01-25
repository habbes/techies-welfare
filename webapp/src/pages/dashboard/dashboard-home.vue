<template>
    <UiSidebarLayout>
        <template #sidebar>
            <UiSidebar>
                <router-link to="/">Home</router-link>
                <router-link to="/">Requests</router-link>
                <router-link to="/">Reports</router-link>

                <template #footer>
                    <router-link to="/">Help</router-link>
                </template>
            </UiSidebar>
        </template>
        <router-view></router-view>
    </UiSidebarLayout>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { authService } from "../../auth";
import { UiSidebar, UiSidebarLayout } from "../../ui-components";

export default defineComponent({
    components: { UiSidebar, UiSidebarLayout },
    setup() {
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
                console.log('token', token);
            }

            
        })
    },
})
</script>
