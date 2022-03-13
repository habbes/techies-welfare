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
            <UiCodeBlock v-if="preview">
                {{ preview }}
            </UiCodeBlock>
            <UiLayout smallGap>
                <UiButton @click="sendMessage">Proceed to send message</UiButton>
                <UiButton secondary @click="close">Cancel</UiButton>
            </UiLayout>
        </UiLayout>
    </UiDialog>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType } from 'vue'
import { apiClient } from '../../api-client';
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
        message: String,
        recipients: Array as PropType<string[]>,
    },
    setup(props) {
        const preview = ref('');
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
                    const res = await apiClient.previewMessage({ message: props.message });
                    preview.value = res.message;
                }
                catch (e) {
                    alert(e.message);
                }
                loadingPreview.value = false;
            }
        }

        async function sendMessage() {
            const report = await apiClient.sendMessage({ message: props.message, recipients: props.recipients });
            close();
            alert(`Message sent.\nNumber of recipients: ${report.numRecipients}\nMessages failed: ${report.numFailed}`);
        }

        return {
            close,
            open,
            dialog,
            preview,
            getPreview,
            sendMessage
        };
    },
})
</script>
