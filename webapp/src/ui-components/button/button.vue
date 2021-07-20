<template>
  <button
    type="button"
    class="rounded-md inline-flex justify-center bg-indigo-500 text-white px-3 py-2 hover:bg-indigo-700 disabled:opacity-50"
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
  },
  setup(props) {
    const classes = computed(() => {
      return {
        "w-full": props.full
      }
    });

    return {
      classes
    };
  }
});
</script>