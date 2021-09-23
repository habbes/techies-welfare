<template>
    <MenuItem v-slot="{ active }">
        <div v-if="!route" :class="{ 'bg-mute': active }" class="px-2 py-2 cursor-pointer focus:bg-mute">
            <slot :active="active"></slot>
        </div>
        <router-link v-else :to="route" :class="{ 'bg-mute': active }" class="flex px-2 py-2 cursor-pointer focus:bg-mute">
            <slot :active="active"></slot>
        </router-link>
    </MenuItem>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { MenuItem } from '@headlessui/vue';

export default defineComponent({
    components: { MenuItem },
    props: {
        route: Object
    },
    setup() {
        
    },
})
</script>
