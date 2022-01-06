<template>
  <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <input
      :type="password ? 'password' : type ? type : 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="inline-flex px-3 py-2 border border-tertiary-light rounded-sm shadow-sm h-8
      focus:border-primary focus:outline-none"
      :class="classes"
      :placeholder="placeholder"
      :required="required">
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    label: String,
    type: String,
    placeholder: String,
    required: Boolean,
    full: Boolean,
    modelValue: String,
    password: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props) {
    const classes = computed(() => {
      return {
        "w-full": props.full,
        "w-72": !props.full
      }
    });

    return {
      classes
    };
  }
})

</script>