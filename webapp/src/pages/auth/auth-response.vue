<template>
    <div>Auth response</div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { authService } from "../../auth";

export default defineComponent({
    setup() {
        onMounted(async () => {
            await authService.handlePostLogin();
        });
    },
})
</script>
