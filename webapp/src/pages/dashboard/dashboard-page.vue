<template>
    <div class="min-h-screen flex flex-col">
        <nav class="flex justify-between items-center bg-white shadow-sm h-14 px-4">
            <div class="flex gap-3">
                <router-link to="/"><img src="/img/logo.png" alt="Logo" style="width:100px" /></router-link>
            </div>
            <div class="flex gap-3">
                <div class="flex items-center">
                    <div class="flex-col mr-3">
                        <div class="text-base">Justin</div>
                        <div class="text-sm text-secondary-light">Administrator</div>
                    </div>
                    <span class="text-secondary-light"><ui-chevron-icon class="cursor-pointer" width="18" height="18"/></span>
                </div>
            </div>
        </nav>
        <main class="flex-1 flex flex-col">
            <router-view></router-view>
        </main>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import UiChevronIcon from "../../ui-components/icons/chevron.vue";

export default defineComponent({
    components: { UiChevronIcon },
    setup() {
        
    },
})
</script>
