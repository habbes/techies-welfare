<template>
  <router-link
    :class="classes"
  >
    <slot></slot>
  </router-link>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { getButtonThemeClasses, getButtonBasePropsDefinition } from "./button-helpers";

export default defineComponent({
  props: getButtonBasePropsDefinition(),
  setup(props) {
    const classes = getButtonThemeClasses(props);

    return {
      classes
    };
  }
});
</script>