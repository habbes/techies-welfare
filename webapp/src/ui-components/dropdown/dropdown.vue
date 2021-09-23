<template>
    <Menu>
        <MenuButton>
            <slot name="activator"></slot>
        </MenuButton>
        <MenuItems
            class="absolute rounded-sm right-0 py-2 px-2 w-56 mt-2 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <slot></slot>
        </MenuItems>
    </Menu>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem} from '@headlessui/vue'

export default defineComponent({
    components: { Menu, MenuButton, MenuItems, MenuItem },
    setup() {
        
    },
})
</script>
