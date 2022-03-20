<template>
  <UiLayout vertical>
    <NavBar :user="user" />
    <UiLayout full justify="center">
      <UiCard v-if="userId" class="lg:w-1/3 md:w-1/2 md:mx-auto mx-2 mt-10">
        <UiForm @submit="initiatePayment">
          <UiLayout smallGap vertical>
            <UiTextBlock>
              Hi {{ name }}. Please enter the amount you wish to contribute.
            </UiTextBlock>
            <UiNumberInput v-model="amount" label="Amount (Ksh)" full />
            <UiText sm secondary>The payment provider may add a transaction fee on top of the amount.</UiText>
            <UiLayout>
              <UiButton full :disabled="loading" submit>Proceed to pay</UiButton>
            </UiLayout>
          </UiLayout>
        </UiForm>
      </UiCard>
      <div v-else class="text-center">
        Error: Unknown user.
      </div>
    </UiLayout>
  </UiLayout>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { apiClient } from "../../api-client";
import { showError } from "../../toasts";
import {
  UiTextBlock,
  UiText,
  UiButton,
  UiCard,
  UiLayout,
  UiNumberInput,
  UiForm
} from "../../ui-components";
import NavBar from "../../components/navbar.vue";
import { authService } from "../../auth";

const router = useRouter();
const route = useRoute();
const userId = route.query.u as string;
const loading = ref(false);
const name = ref(route.query.n || "");
const email = ref(route.query.e || "");
const phone = ref(route.query.p || "");
const amount = ref(route.query.a && Number(route.query.a) || 0);
const user = ref();

onMounted(async () => {
  if (authService.isAuthenticated()) {
    try {
      const loggedInUser = await apiClient.getLoggedInUser();

      if (loggedInUser._id !== userId) {
        showError("A different user was logged in on this device.");
        await authService.logout();
        // TODO: ideally we should not manually redirect to login
        // since authService.logout() should handle that
        // but because of a bug, that tends to fail
        router.push({ name: "login" });
      }
      else {
        user.value = loggedInUser;
      }
    }
    catch (e: any) {
      showError(e.message);
    }
  }
});

async function initiatePayment() {
  loading.value = true;
  try {
    const trx = await apiClient.initiatePayment({ userId, amount: amount.value});
    if (trx && trx.metadata && trx.metadata.paymentUrl) {
      window.location = trx.metadata.paymentUrl;
    }
    else {
      showError("Failed to initiate payment. Kindly try again later.");
    }
  }
  catch (e: any) {
    showError(e.message);
  }

  loading.value = false;
}
</script>
