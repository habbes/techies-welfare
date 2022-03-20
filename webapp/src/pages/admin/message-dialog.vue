<template>
    <UiDialog ref="dialog" @open="getPreview" title="Confirm message to send">
        <UiLayout v-if="loadingPreview">
            Generating preview. Please wait...
        </UiLayout>
        <UiLayout vertical smallGap>
            <UiTextBlock>
                Here's a preview of the message that will be sent to the following recipients:
                <UiText monospace v-for="recipient in recipients" :key="recipient">{{ recipient }}, </UiText>
            </UiTextBlock>
            <UiText bold v-if="preview">{{ preview.subject }}</UiText>
            <UiCodeBlock v-if="preview">
                {{ preview.message }}
            </UiCodeBlock>
            <UiLayout smallGap>
                <UiButton @click="sendMessage">Proceed to send message</UiButton>
                <UiButton secondary @click="close">Cancel</UiButton>
            </UiLayout>
        </UiLayout>
    </UiDialog>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { PreviewMessageResult } from "../../services";
import { apiClient } from '../../api-client';
import { showError, showInfo } from "../../toasts";
import {
    UiDialog,
    UiText,
    UiTextBlock,
    UiCodeBlock,
    UiLayout,
    UiButton
} from "../../ui-components";

export default defineComponent({
    components: {
        UiDialog,
        UiText,
        UiTextBlock,
        UiCodeBlock,
        UiLayout,
        UiButton
    },
    props: {
        message: {
            type: String,
            required: true
        },
        subject: String,
        recipients: {
            type: Array as PropType<string[]>,
            required: true
        }
    },
    setup(props) {
        const preview = ref<PreviewMessageResult>();
        const dialog = ref();
        const loadingPreview = ref(false);

        function close() {
            dialog.value.close();
        }

        function open() {
            dialog.value.open();
        }

        async function getPreview() {
            if (props.message) {
                loadingPreview.value = true;
                try {
                    preview.value = await apiClient.previewMessage({
                        message: props.message,
                        subject: props.subject
                    });
                }
                catch (e: any) {
                    showError(e.message);
                }
                loadingPreview.value = false;
            }
        }

        async function sendMessage() {
            try {
                const report = await apiClient.sendMessage({
                    message: props.message,
                    recipients: props.recipients,
                    subject: props.subject });
                close();
                showInfo(`Message sent.\nNumber of recipients: ${report.numRecipients}\nMessages failed: ${report.numFailed}`);
            }
            catch (e: any) {
                showError(e.message);
            }
        }

        return {
            close,
            open,
            dialog,
            preview,
            getPreview,
            sendMessage,
            loadingPreview
        };
    },
})
</script>
