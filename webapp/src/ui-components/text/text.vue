<template>
    <span :class="classes">
        <slot></slot>
    </span>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        primary: Boolean,
        secondary: Boolean,
        danger: Boolean,
        sm: Boolean,
        lg: Boolean,
        xl: Boolean
    },
    setup(props) {
        const classes = computed(() => {
            const normal = !(props.primary || props.secondary || props.danger);
            return {
                'text-body': normal,
                'text-primary': props.primary,
                'text-secondary': props.secondary,
                'text-danger': props.danger,
                'text-sm': props.sm,
                'text-lg': props.lg,
                'text-xl': props.xl
            };
        });

        return {
            classes
        };
    },
})
</script>
