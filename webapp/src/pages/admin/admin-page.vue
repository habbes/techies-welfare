<template>
    <div class="flex-1 flex items-stretch">
        <div class="bg-gray-700 border-r w-72 shadow-sm color-white pt-5 flex flex-col">
            <MenuLink :to="{ name: 'admin-members' }">Members</MenuLink>
            <MenuLink :to="{ name: 'admin-messaging' }">Send Message</MenuLink>
            <MenuLink :to="{ name: 'admin-payments' }">Payments</MenuLink>
        </div>
        <div class="flex-1 py-8 px-20">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import MenuLink from "./sidebar-menu-link.vue";

export default defineComponent({
    components: {
        MenuLink
    },
    setup() {
    },
})
</script>
