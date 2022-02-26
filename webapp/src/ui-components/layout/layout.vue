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
        /**
         * Makes the layout vertical
         * with children laid out top to bottom
         */
        vertical: Boolean,
        /**
         * Fills the width of the parent
         */
        fill: Boolean,
        /**
         * Specifies how children will be arranged
         * along the main axis, possible options are:
         * `center`, `start`, `end`, `between`, `evenly` and `around`
         */
        justify: String as PropType<Justify>,
        /**
         * Specifies how children will be aligned
         * across the axis, possible options are:
         * `center`, `start`, `end`, `stretch`, `baseline`
         */
        align: String as PropType<Align>,
        /**
         * Sets the size of the gap space between elements.
         * Prefer using the following props instead to maintain consistency:
         *  `smallGap`,`tinyGap`
         */
        gap: Number,
        /**
         * Sets a small gap space between elements.
         * This is the most commonly use gap
         */
        smallGap: Boolean,
        /**
         * Sets a minimal gap space between elements
         */
        tinyGap: Boolean
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
            "gap-3": props.smallGap,
            "gap-1": props.tinyGap,
            [`gap-${props.gap}`]: props.gap !== undefined,
        }));

        return {
            classes,
        };
    },
})
</script>
