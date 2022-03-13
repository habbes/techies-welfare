<template>
  <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <input
      type="number"
      :value="modelValue"
      @input="$emit('update:modelValue', Number($event.target.value))"
      style="font-size:14px"
      :class="classes"
      :placeholder="placeholder"
      :required="required">
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { getTextFieldCommonClasses, getTextFieldCommonProps } from "./util";

export default defineComponent({
  props: {
    ...getTextFieldCommonProps(),
    modelValue: Number
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