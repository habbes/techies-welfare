<template>
  <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <input
      :type="password ? 'password' : type ? type : 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
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
    type: String,
    modelValue: String || Number,
    password: Boolean,
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