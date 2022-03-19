<template>
    <div>Auth response</div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { authService } from "../../auth";
import { showError } from '../../toasts';

export default defineComponent({
    setup() {
        onMounted(async () => {
            try {
                await authService.handlePostLogin();
            }
            catch (e) {
                showError(e.message);
            }
        });
    },
})
</script>
