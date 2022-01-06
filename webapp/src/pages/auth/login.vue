<template>
    <div class="flex justify-center items-center flex-1">
        <div class="border-t-8 border-secondary">
        <div class="bg-white py-12 px-8 border rounded-b-sm" style="border-color:#e4eaf4" box-shadow="inset 0px 6px 0px #095cA5">
            <UiH2>User login</UiH2>
            <form>
                <UiInputGroup>
                    <UiTextInput label="Email address" />
                </UiInputGroup>
                <UiInputGroup>
                    <UiTextInput label="Password" password />
                </UiInputGroup>
                <UiInputGroup>
                    <UiLayout justify="end">
                        <UiButton disabled>Log in</UiButton>
                    </UiLayout>
                </UiInputGroup>
                <div class="text-primary text-sm">Forgot your password?</div>
            </form>
        </div>
        </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {
    UiH2,
    UiInputGroup,
    UiTextInput,
    UiButton,
    UiLayout,
} from '../../ui-components';

export default defineComponent({
    components: {
        UiH2,
        UiInputGroup,
        UiTextInput,
        UiButton,
        UiLayout
    },
    setup() {
        
    },
})
</script>
