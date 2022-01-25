<template>
    <UiSidebarLayout>
        <template #sidebar>
            <UiSidebar>
                <router-link :to="{ name: 'admin-members' }">Members</router-link>
                <router-link :to="{ name: 'admin-messaging' }">Send Message</router-link>
                <router-link :to="{ name: 'admin-payments' }">Payments</router-link>
            </UiSidebar>
        </template>
        <router-view></router-view>
    </UiSidebarLayout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { UiSidebar, UiSidebarLayout } from '../../ui-components';
import MenuLink from "./sidebar-menu-link.vue";

export default defineComponent({
    components: {
        MenuLink,
        UiSidebar,
        UiSidebarLayout
    },
    setup() {
    },
})
</script>
