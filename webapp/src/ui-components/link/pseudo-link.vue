<template>
  <span
    class="text-primary hover:text-primary-light cursor-pointer"
    :class="classes"
  >
    <slot></slot>
  </span>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

/**
 * This is a piece of text that looks like a link
 * but does not have a destination. It's meant
 * to be trigger using an on:click handler.
 */
export default defineComponent({
  props: {
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
  },
  setup(props) {
    const classes = computed(() => {
      return {
        "text-sm": props.sm,
        "text-lg": props.lg,
        "text-xl": props.xl,
      };
    });

    return {
      classes,
    };
  },
});
</script>