<template>
    <router-link :to="to" class="px-8 py-5 text-white hover:bg-green-50 hover:text-gray-600">
        <slot></slot>
    </router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        to: Object
    },
    setup() {
        
    },
})
</script>
