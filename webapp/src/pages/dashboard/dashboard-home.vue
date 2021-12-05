<template>
    <div class="flex-1 flex items-stretch px-5 py-5 text-sm">
        <div class="bg-dark rounded-md w-32 shadow-sm text-white py-5 flex flex-col items-center justify-between">
            <div class="flex flex-col gap-6">
                <router-link to="/">Home</router-link>
                <router-link to="/">Requests</router-link>
                <router-link to="/">Reports</router-link>
            </div>
            <div>
                <router-link to="/">Help</router-link>
            </div>
        </div>
        <div class="flex-1 py-8 px-20">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { authService } from "../../auth";

export default defineComponent({
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
