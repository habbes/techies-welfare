import { RouteRecordRaw } from "vue-router";
import DashboardPage from "../pages/dashboard/dashboard-page.vue";
import DashboardHome from "../pages/dashboard/dashboard-home.vue";
import ContributionsPage from "../pages/dashboard/contributions-page.vue";
import MyPaymentDetailsPage from "../pages/dashboard/my-payment-details.vue";
import PaymentPage from "../pages/payment/payment-page.vue";
import FlutterWavePostPaymentPage from "../pages/payment/flutterwave-post-payment.vue";
import AdminPage from "../pages/admin/admin-page.vue";
import AdminMembersPage from "../pages/admin/members/members.vue";
import AdminAddMemberPage from "../pages/admin/members/add-member.vue";
import AdminMemberDetailsPage from "../pages/admin/members/member-details.vue";
import AdminPaymentsPage from "../pages/admin/payments/payments.vue";
import AdminPaymentDetailsPage from "../pages/admin/payments/payment-details.vue";
import AdminMessagingPage from "../pages/admin/messaging.vue";
import AuthResponse from "../pages/auth/auth-response.vue";
import LoginPage from "../pages/auth/login.vue";

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DashboardPage,
        name: "dashboard",
        children: [
            {
                path: "",
                component: DashboardHome,
                name: "dashboard-home",
                children: [
                    {
                        path: "",
                        name: "contributions",
                        component: ContributionsPage
                    },
                    {
                        path: "payments/:id",
                        name: "my-payment-details",
                        component: MyPaymentDetailsPage
                    }
                ]
            },
            {
                path: "/auth/login",
                component: LoginPage,
                name: 'login',
                meta: {
                    noAuth: true
                }
            },
            {
                path: "/admin",
                component: AdminPage,
                name: "admin",
                children: [
                    {
                        path: "members",
                        name: "admin-members",
                        component: AdminMembersPage
                    },
                    {
                        path: "members/:id",
                        name: "admin-member-details",
                        component: AdminMemberDetailsPage
                    },
                    {
                        path: "members/new",
                        name: "admin-add-member",
                        component: AdminAddMemberPage
                    },
                    {
                        path: "messaging",
                        name: "admin-messaging",
                        component: AdminMessagingPage
                    },
                    {
                        path: "payments",
                        name: "admin-payments",
                        component: AdminPaymentsPage
                    },
                    {
                        path: "payments/:id",
                        name: "admin-payment-details",
                        component: AdminPaymentDetailsPage
                    }
                ]
            }
        ]
    },
    {
        path: '/pay',
        component: PaymentPage,
        name: "pay",
        meta: {
            noAuth: true
        }
    },
    {
        path: '/post-payment/flutterwave',
        component: FlutterWavePostPaymentPage,
        name: 'flutterwave-post-payment',
        meta: {
            noAuth: true
        }
    },
    {
        path: '/auth-response',
        component: AuthResponse,
        name: 'auth-response'
    }
];
