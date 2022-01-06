<template>
  <button
    :type="type"
    class="rounded-sm inline-flex h-8 justify-center items-center text-white px-3 py-2 disabled:bg-disabled text-sm"
    :class="classes"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    full: Boolean,
    submit: Boolean,
    primary: Boolean,
    secondary: Boolean,
  },
  setup(props) {

    const classes = computed(() => {
      const primary = props.primary || !(props.secondary);
      return {
        "w-full": props.full,
        "bg-primary": primary,
        "hover:bg-primary-light": primary,
        "focus:bg-primary-dark": primary,
        "bg-secondary": props.secondary,
        "hover:bg-secondary-light": props.secondary,
        "hover:bg-secondary-dark": props.secondary
      }
    });

    const type = computed(() => {
      return props.submit ? "submit" : "button";
    })

    return {
      classes,
      type,
    };
  }
});
</script>