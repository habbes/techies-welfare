<template>
    <form @submit.prevent="onSubmit">
        <slot></slot>
    </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    emits: ['submit'],
    setup(props, { emit }) {
        function onSubmit() {
            emit('submit');
        }

        return {
            onSubmit
        };
    },
})
</script>
