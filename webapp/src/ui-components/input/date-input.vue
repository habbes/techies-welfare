<template>
  <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <input
      type="date"
      :value="dateString"
      @input="$emit('update:modelValue', new Date($event.target.value))"
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
    modelValue: Date,
  },
  emits: ["update:modelValue"],
  setup(props) {
    const classes = computed(() => {
      return {
        ...getTextFieldCommonClasses(props)
      }
    });

    const dateString = computed(() => props.modelValue?.toISOString().split("T")[0]);

    return {
      classes,
      dateString
    };
  }
})

</script>