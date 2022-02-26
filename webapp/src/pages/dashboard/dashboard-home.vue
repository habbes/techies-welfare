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
import { defineComponent } from 'vue'
import { UiSidebar, UiSidebarLayout } from "../../ui-components";

export default defineComponent({
    components: { UiSidebar, UiSidebarLayout },
});
</script>
