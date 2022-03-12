<template>
    <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      style="font-size:14px"
      :class="classes"
      :placeholder="placeholder"
      :required="required">
      <option disabled :value="undefined">{{ defaultText || "Select option" }}</option>
      <slot></slot>
    </select>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { getTextFieldCommonClasses, getTextFieldCommonProps } from "./util";

export default defineComponent({
  props: {
    ...getTextFieldCommonProps(),
    defaultText: String,
    modelValue: String
  },
  emits: ["update:modelValue"],
  setup(props) {
    const classes = computed(() => {
      return {
        ...getTextFieldCommonClasses(props)
      }
    });

    return {
      classes
    };
  }
})

</script>