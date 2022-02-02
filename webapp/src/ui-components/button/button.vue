<template>
  <button
    :type="type"
    :class="classes"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { getButtonBasePropsDefinition, getButtonThemeClasses } from "./button-helpers";

export default defineComponent({
  props: getButtonBasePropsDefinition(),
  setup(props) {

    const classes = getButtonThemeClasses(props);

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