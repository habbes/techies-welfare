<template>
    <div class="grid" :class="classes">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        gap: Number,
        rows: Number,
        cols: Number
    },
    setup(props) {

        const classes = computed(() => ({
            [`gap-${props.gap}`]: props.gap !== undefined,
            [`grid-rows-${props.rows}`]: props.rows !== undefined,
            [`grid-cols-${props.cols}`]: props.cols !== undefined
        }));

        return {
            classes,
        };
    },
})
</script>
