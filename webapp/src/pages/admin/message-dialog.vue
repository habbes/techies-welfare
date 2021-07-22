<template>
    <ui-dialog ref="dialog" @open="getPreview" title="Confirm message to send">
        <div v-if="loadingPreview">
            Generating preview. Please wait...
        </div>
        <div>
            <p class="mb-3">
                Here's a preview of the message that will be sent to the following recipients:
            <span class="font-mono inline-block mr-3" v-for="recipient in recipients" :key="recipient">{{ recipient }}</span>
            </p>
            <p class="mb-3 border border-gray-100 bg-gray-50 font-mono p-3 overflow-auto text-sm" v-if="preview">
                {{ preview }}
            </p>
            <div class="flex justify-end gap-2">
                <ui-button primary @click="sendMessage">Proceed to send message</ui-button>
                <ui-button class="ml-2" @click="close">Cancel</ui-button>
            </div>
        </div>
    </ui-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, PropType } from 'vue'
import { apiClient } from '../../api-client';

export default defineComponent({
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
