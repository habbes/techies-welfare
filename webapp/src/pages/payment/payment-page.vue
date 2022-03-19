<template>
  <div>
  <div class="flex justify-center"><img src="/img/logo.png" class="h-72"></div>
  <div class="w-full mx-auto bg-gray-50">
    <ui-card v-if="userId" class="lg:w-1/3 md:w-1/2 md:mx-auto mx-2 mt-10">
      <form>
        <p class="mb-5">Hi {{ name }}. Please enter the amount you wish to contribute.</p>
        <ui-text-input v-model="amount" label="Amount (Ksh)" type="number" full class="mb-3"/>
        <div>
          <ui-button full @click="initiatePayment" :disabled="loading">Proceed to pay</ui-button>
        </div>
      </form>
    </ui-card>
    <div v-else class="text-center">
      Error: Unknown user.
    </div>
  </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from "vue-router";
import { apiClient } from "../../api-client";
import { showError } from "../../toasts";
import UiTextInput from "../../ui-components/input/text-input.vue";
import UiButton from "../../ui-components/button/button.vue";
import UiCard from "../../ui-components/card/card.vue";

export default defineComponent({
  name: 'App',
  components: {
    UiTextInput,
    UiButton,
    UiCard
  },
  setup() {
    const route = useRoute();
    const userId = Array.isArray(route.query.u) ? route.query.u[0] : route.query.u;
    const loading = ref(false);
    const name = ref(route.query.n || "");
    const email = ref(route.query.e || "");
    const phone = ref(route.query.p || "");
    const amount = ref(route.query.a && Number(route.query.a) || 0);

    async function initiatePayment() {
      loading.value = true;
      try {
        const trx = await apiClient.initiatePayment({ userId, amount: amount.value});
        if (trx && trx.metadata && trx.metadata.paymentUrl) {
          window.location = trx.metadata.paymentUrl;
        }
      }
      catch (e) {
        showError(e.message);
      }

      loading.value = false;
    }

    return {
      userId,
      name,
      email,
      phone,
      amount,
      loading,
      initiatePayment
    };
  }
})
</script>
