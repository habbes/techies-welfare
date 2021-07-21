<template>
    <div class="min-h-screen flex flex-col">
        <nav class="flex justify-between items-center bg-white shadow-sm h-14 px-14">
            <div class="flex gap-3">
                <router-link to="/">Techies Welfare</router-link>
            </div>
            <div class="flex gap-3">
                <router-link :to="{ name: 'admin' }">Admin</router-link>
                <span>Sign Out</span>
            </div>
        </nav>
        <main class="flex-1 flex flex-col">
            <router-view></router-view>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        
    },
})
</script>
