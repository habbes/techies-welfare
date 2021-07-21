<template>
    <div>
        <ui-h2>Send bulk message</ui-h2>
        <div>
            <form @submit.prevent="sendMessage">
                <ui-text-input v-model="recipientsText" label="Recipients" placeholder="Comma-separate list of recipients" full class="mb-3" required/>
                <p class="mb-3">
                    You can enter individual phone numbers, or the <span class="font-mono font-bold">all</span> keyword
                    to target all members.
                </p>
                <ui-text-area label="Message" required full v-model="message"/>
                <p class="mb-3">
                    You can use the following placeholders in your message:
                    <span class="font-mono">{firstName}</span>,
                    <span class="font-mono">{totalContribution}</span>,
                    <span class="font-mono">{arrears}</span>,
                    <span class="font-mono">{paymentLink}</span>,
                    <span class="font-mono">{baseUrl}</span>.
                </p>
                <ui-button submit>Send Message</ui-button>
            </form>
        </div>
        <MessageDialog ref="messageDialog" :message="message" :recipients="recipients"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import MessageDialog from "./message-dialog.vue";

export default defineComponent({
    components: { MessageDialog },
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
