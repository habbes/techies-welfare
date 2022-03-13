<template>
    <UiLayout vertical>
        <UiH2>Send bulk message</UiH2>
        <UiCard>
            <UiForm @submit="sendMessage">
                <UiLayout vertical smallGap>
                    <UiTextInput
                        v-model="recipientsText"
                        label="Recipients"
                        placeholder="Comma-separate list of recipients"
                        required/>
                    <UiTextBlock>
                        You can enter individual phone numbers, or the 
                        <UiText monospace bold>all</UiText>
                        keyword
                        to target all members.
                    </UiTextBlock>
                    <UiTextArea
                        label="Message"
                        required
                        full
                        v-model="message"
                        />
                    <UiTextBlock>
                        You can use the following placeholders in your message:
                        <UiText monospace>{firstName}</UiText>,
                        <UiText monospace>{totalContribution}</UiText>,
                        <UiText monospace>{arrears}</UiText>,
                        <UiText monospace>{paymentLink}</UiText>,
                        <UiText monospace>{baseUrl}</UiText>.
                    </UiTextBlock>
                    <UiLayout>
                        <UiButton submit>Send Message</UiButton>
                    </UiLayout>
                </UiLayout>
            </UiForm>
        </UiCard>
        <MessageDialog ref="messageDialog" :message="message" :recipients="recipients"/>
    </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import {
    UiForm,
    UiLayout,
    UiButton,
    UiText,
    UiTextBlock,
    UiTextInput,
    UiTextArea,
    UiH2,
    UiCard
    } from "../../ui-components";
import MessageDialog from "./message-dialog.vue";

export default defineComponent({
    components: {
        MessageDialog,
        UiForm,
        UiLayout,
        UiButton,
        UiText,
        UiTextBlock,
        UiTextInput,
        UiTextArea,
        UiH2,
        UiCard
    },
    setup() {
        const messageDialog = ref();
        const recipientsText = ref('');
        const message = ref('');

        const recipients = computed(() => {
            return recipientsText.value.split(',').map(r => r.trim());
        });

        function sendMessage() {
            messageDialog.value.open();
        }

        return {
            message,
            recipientsText,
            recipients,
            messageDialog,
            sendMessage,
        };
    },
})
</script>
