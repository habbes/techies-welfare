<template>
  <Dialog
    :open="isOpen"
    @close="close"
    class="fixed inset-0 z-10 overflow-y-auto"
  >
    <div class="flex items-center justify-center min-h-screen">
      <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
      <div class="mx-auto bg-white rounded shadow-md z-20 p-7 w-1/3">
        <DialogTitle
          as="h3"
          class="text-lg text-center font-medium leading-6 text-gray-900 mb-5"
          >{{ title }}
        </DialogTitle>
        <slot></slot>
      </div>
    </div>
  </Dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";

export default defineComponent({
  components: { Dialog, DialogOverlay, DialogTitle },
  props: {
    title: String,
  },
  emits: ["open", "close"],
  setup(props, { emit }) {
    const isOpen = ref(false);

    function close() {
      isOpen.value = false;
      emit("close");
    }

    function open() {
      isOpen.value = true;
      emit("open");
    }

    return {
      isOpen,
      close,
      open,
    };
  },
});
</script>
