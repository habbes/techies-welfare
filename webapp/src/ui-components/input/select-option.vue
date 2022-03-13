<template>
    <option :value="value">{{ label }}</option>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: ["value", "label"]
});
</script>