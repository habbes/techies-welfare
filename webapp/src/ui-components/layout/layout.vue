<template>
    <div class="flex" :class="classes">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

type Justify = 'center' | 'start' | 'end' | 'between' | 'evenly' | 'around';
type Align = 'center' | 'start' | 'end' | 'stretch' | 'baseline';

export default defineComponent({
    props: {
        vertical: Boolean,
        fill: Boolean,
        justify: String as PropType<Justify>,
        align: String as PropType<Align>,
        gap: Number
    },
    setup(props) {

        const classes = computed(() => ({
            "flex-col": props.vertical,
            "flex-1": props.fill,
            "justify-center": props.justify === 'center',
            "justify-start": props.justify === 'start',
            "justify-end": props.justify === 'end',
            "justify-between": props.justify === 'between',
            "justify-evenly": props.justify === 'evenly',
            "justify-around": props.justify === 'around',
            "items-center": props.align === 'center',
            "items-start": props.align === 'start',
            "items-end": props.align === 'end',
            "items-stretch": props.align === 'stretch',
            "items-baseline": props.align === 'baseline',
            [`gap-${props.gap}`]: props.gap !== undefined,
        }));

        return {
            classes,
        };
    },
})
</script>
