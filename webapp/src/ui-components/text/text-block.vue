<template>
    <p :class="classes">
        <slot></slot>
    </p>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

/**
 * A block or paragraph of text
 * that can nest other inline text elements.
 */
export default defineComponent({
    props: {
        /**
         * Use primary text color
         */
        primary: Boolean,
        /**
         * Use secondary text color
         */
        secondary: Boolean,
        /**
         * Use danger text color
         */
        danger: Boolean,
        /**
         * Make the text small
         */
        sm: Boolean,
        /**
         * Make the text large
         */
        lg: Boolean,
        /**
         * Make the text extra-large
         */
        xl: Boolean,
        /**
         * Use a monospace font style
         */
        monospace: Boolean,
        /**
         * Make the text bold
         */
        bold: Boolean,
    },
    setup(props) {
        const classes = computed(() => {
            const normal = !(props.primary || props.secondary || props.danger);
            return {
                'text-secondary': normal,
                'text-primary': props.primary,
                'text-body': props.secondary,
                'text-danger': props.danger,
                'text-sm': props.sm,
                'text-lg': props.lg,
                'text-xl': props.xl,
                'font-mono': props.monospace,
                'font-semibold': props.bold,
            };
        });

        return {
            classes
        };
    },
})
</script>
