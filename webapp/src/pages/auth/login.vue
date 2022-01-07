<template>
    <UiLayout justify="center" align="center" fill>
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
                            <UiButton submit>Log in</UiButton>
                        </UiLayout>
                    </UiInputGroup>
                    <UiText primary sm>Forgot your password?</UiText>
                </form>
            </div>
        </div>
  </UiLayout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {
    UiH2,
    UiText,
    UiInputGroup,
    UiTextInput,
    UiButton,
    UiLayout,
} from '../../ui-components';

export default defineComponent({
    components: {
        UiH2,
        UiText,
        UiInputGroup,
        UiTextInput,
        UiButton,
        UiLayout
    },
    setup() {
        
    },
})
</script>
