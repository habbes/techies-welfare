import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "../pages/dashboard/dashboard-page.vue";
import DashboardHome from "../pages/dashboard/dashboard-home.vue";
import PaymentPage from "../pages/payment/payment-page.vue";
import AdminPage from "../pages/admin/admin-page.vue";
import AdminMembersPage from "../pages/admin/members/members.vue";
import AdminAddMemberPage from "../pages/admin/members/add-member.vue";
import AdminMemberDetailsPage from "../pages/admin/members/member-details.vue";
import AdminPaymentsPage from "../pages/admin/payments/payments.vue";
import AdminMessagingPage from "../pages/admin/messaging.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/',
      component: DashboardPage,
      name: "dashboard",
      children: [
        {
          path: "/",
          component: DashboardHome,
          name: "dashboard-home"
        },
        {
          path: "/admin",
          component: AdminPage,
          name: "admin",
          children: [
            {
              path: "/members",
              name: "admin-members",
              component: AdminMembersPage
            },
            {
              path: "/members/:id",
              name: "admin-member-details",
              component: AdminMemberDetailsPage
            },
            {
              path: "/members/new",
              name: "admin-add-member",
              component: AdminAddMemberPage
            },
            {
              path: "/messaging",
              name: "admin-messaging",
              component: AdminMessagingPage
            },
            {
              path: "/payments",
              name: "admin-payments",
              component: AdminPaymentsPage
            }
          ]
        }
      ]
    },
    {
      path: '/pay',
      component: PaymentPage,
      name: "pay"
    }
  ]
});

export { router };
