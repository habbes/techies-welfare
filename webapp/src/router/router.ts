import { createRouter, createWebHistory } from "vue-router";
import PaymentPage from "../pages/payment/payment-page.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/pay', component: PaymentPage }
  ]
});

export { router };
