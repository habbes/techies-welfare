import { createRouter, createWebHistory } from "vue-router";
import PaymentPage from "../pages/payment/payment-page.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/payment', component: PaymentPage }
  ]
});

export { router };
