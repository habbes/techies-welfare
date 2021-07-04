<template>
  <div>
  <h2 class="text-xl font-bold m-4 text-center">Techies Welfare Contribution</h2>
  <div class="w-full mx-auto bg-gray-50">
    <div class="bg-white py-8 px-6 shadow rounded-lg lg:w-1/3 md:w-1/2 md:mx-auto mx-2 mt-10">
      <form>
        <ui-text-input v-model="name" label="Name" type="text" full class="mb-3"/>
        <ui-text-input v-model="phone" label="Phone" type="tel" full class="mb-3"/>
        <ui-text-input v-model="email" label="Email" type="email" full class="mb-3"/>
        <ui-text-input v-model="amount" label="Amount" type="number" full class="mb-3"/>
        <div>
          <ui-button full>Proceed to pay</ui-button>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from "vue-router";
import UiTextInput from "../../ui-components/input/text-input.vue";
import UiButton from "../../ui-components/button/button.vue";

export default defineComponent({
  name: 'App',
  components: {
    UiTextInput,
    UiButton
  },
  setup() {
    const route = useRoute();
    const name = ref(route.query.n || "");
    const email = ref(route.query.e || "");
    const phone = ref(route.query.p || "");
    const amount = ref(route.query.a && Number(route.query.a) || 0);

    return {
      name,
      email,
      phone,
      amount
    };
  }
})
</script>
