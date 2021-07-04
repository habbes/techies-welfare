<template>
  <div class="">
    <label class="block text-sm font-medium mb-1">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="inline-flex px-3 py-2 border border-gray-100 rounded-lg shadow-sm
      focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      :class="classes"
      required>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    label: String,
    type: String,
    full: Boolean,
    modelValue: String,
  },
  emits: ["update:modelValue"],
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
})

</script>