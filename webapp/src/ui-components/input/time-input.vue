<template>
  <div class="">
    <label v-if="label" class="block text-sm mb-1 text-body">{{ label }}</label>
    <input
      type="time"
      :value="timeString"
      @input="onInput"
      style="font-size:14px"
      :class="classes"
      :placeholder="placeholder"
      :required="required">
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { getTextFieldCommonClasses, getTextFieldCommonProps } from "./util";

interface TimeInputValue {
    hour: number;
    minute: number;
}

export default defineComponent({
  props: {
    ...getTextFieldCommonProps(),
    modelValue: Object as PropType<TimeInputValue>,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const classes = computed(() => {
      return {
        ...getTextFieldCommonClasses(props)
      }
    });

    const timeString = computed(() => {
        if (!props.modelValue) return "";

        const { hour, minute } = props.modelValue;
        const hourString = hour >= 10 ? `${hour}` : `0${hour}`;
        const minuteString = minute >= 10 ? `${minute}` : `0${minute}`;
        return `${hourString}:${minuteString}`;
    });
    
    function onInput(event) {
        const rawValue = event.target.value;
        const [h, m] = rawValue.split(":");
        const value: TimeInputValue = { hour: Number(h), minute: Number(m) };
        emit("update:modelValue", value);
    }

    return {
      classes,
      timeString,
      onInput
    };
  }
})

</script>