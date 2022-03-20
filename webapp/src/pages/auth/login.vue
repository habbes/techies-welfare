<template>
    <UiLayout justify="center" align="center" fill>
        <div class="border-t-8 border-secondary">
            <div class="bg-white py-12 px-8 border rounded-b-sm" style="border-color:#e4eaf4" box-shadow="inset 0px 6px 0px #095cA5">
                <UiH2>User login</UiH2>
                <UiForm @submit="submitUsername" v-if="state === 'username'">
                    <UiInputGroup>
                        <UiTextInput
                            v-model="login"
                            label="Email or Phone"
                            placeholder="e.g.: john@mailer.com or 254722111222"
                            required 
                        />
                    </UiInputGroup>
                    <UiInputGroup>
                        <UiLayout justify="end">
                            <UiButton submit>Next</UiButton>
                        </UiLayout>
                    </UiInputGroup>
                </UiForm>
                <UiForm @submit="submitLogin" v-else-if="state === 'enterOtp'">
                    <UiLayout vertical smallGap>
                        <UiLayout vertical tinyGap>
                            <UiText sm>Enter the code you received on your phone or email.</UiText>
                            <UiText sm>The code is valid for 2 minutes.</UiText>
                        </UiLayout>
                        <UiTextInput
                            v-model="otp"
                            label="Pass Code"
                            placeholder="Example: 123456"
                            required 
                        />
                        <UiLayout justify="between" align="center">
                            <UiPseudoLink @click="goToUsernameState" sm>Back</UiPseudoLink>
                            <UiLayout justify="end" smallGap>
                                <UiButton submit>Login</UiButton>
                                <UiButton @click="resendCode" secondary>Resend code</UiButton>
                            </UiLayout>
                        </UiLayout>
                    </UiLayout>
                </UiForm>
            </div>
        </div>
  </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router';
import { showError, showInfo } from "../../toasts";
import { apiClient } from "../../api-client";
import { authService } from "../../auth";
import { LocalAuthService } from '../../services';
import { useUser } from "../../store";

import {
    UiH2,
    UiText,
    UiInputGroup,
    UiTextInput,
    UiButton,
    UiLayout,
    UiForm,
    UiPseudoLink
} from '../../ui-components';

type PageState = 'username' | 'enterOtp';

export default defineComponent({
    components: {
        UiH2,
        UiText,
        UiInputGroup,
        UiTextInput,
        UiButton,
        UiLayout,
        UiForm,
        UiPseudoLink
    },
    setup() {
        const login = ref("");
        const password = ref("");
        const otp = ref("");
        const router = useRouter();
        const state = ref<PageState>('username');

        function reset() {
            login.value = "";
            password.value = "";
            otp.value = "";
            state.value = 'username';
        }

        function goToUsernameState() {
            state.value = 'username';
        }

        async function submitUsername() {
            try {
                await apiClient.requestOtp({ login: login.value });
                state.value = 'enterOtp';
            }
            catch (e: any) {
                showError(e.message);
            }
        }

        async function resendCode() {
            try {
                await apiClient.requestOtp({ login: login.value });
                showInfo("Passcode has been resent.")
            }
            catch (e: any) {
                showError(e.message);
            }
        }

        async function submitLogin() {
            try {
                const result = await apiClient.login({ login: login.value, otp: otp.value });

                // this manual login page is only used by the LocalAuthService
                // so it's safe to assume authService is a LocalAuthService instance
                (authService as LocalAuthService).setAccessToken(result.token._id);

                login.value = "";
                password.value = "";

                useUser().user.value = result.user;

                if (router.currentRoute.value.query.redirect) {
                    router.push(router.currentRoute.value.query.redirect as string)
                }
                else {
                    router.push({ name: "contributions" });
                }

                reset();
            }
            catch (e: any) {
                showError(e.message);
            }
        }

        return {
            login,
            password,
            otp,
            submitUsername,
            submitLogin,
            resendCode,
            state,
            goToUsernameState
        }
    },
})
</script>
