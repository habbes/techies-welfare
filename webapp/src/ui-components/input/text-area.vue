<template>
  <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      style="font-size:14px"
      :class="classes"
      :placeholder="placeholder"
      :required="required">
    </textarea>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { getTextFieldCommonProps, getTextFieldCommonClasses } from "./util";

export default defineComponent({
  props: {
    ...getTextFieldCommonProps(),
    modelValue: String,
  },
  emits: ["update:modelValue"],
  setup(props) {
    const classes = computed(() => {
      return {
        ...getTextFieldCommonClasses(props),
        "h-24": true,
      }
    });

    return {
      classes
    };
  }
})

</script>