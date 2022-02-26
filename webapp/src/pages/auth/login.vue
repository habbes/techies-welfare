<template>
    <UiLayout justify="center" align="center" fill>
        <div class="border-t-8 border-secondary">
            <div class="bg-white py-12 px-8 border rounded-b-sm" style="border-color:#e4eaf4" box-shadow="inset 0px 6px 0px #095cA5">
                <UiH2>User login</UiH2>
                <form @submit.prevent="submitLogin">
                    <UiInputGroup>
                        <UiTextInput
                            v-model="login"
                            label="Email or Phone"
                            placeholder="john@mailer.com or 722111222"
                            required 
                        />
                    </UiInputGroup>
                    <UiInputGroup>
                        <UiTextInput
                            v-model="password"
                            label="Password"
                            password
                            required
                        />
                    </UiInputGroup>
                    <UiInputGroup>
                        <UiLayout justify="end">
                            <UiButton submit>Log in</UiButton>
                        </UiLayout>
                    </UiInputGroup>
                    <UiText primary sm>Forgot your password?</UiText>
                </form>
            </div>
        </div>
  </UiLayout>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router';
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
} from '../../ui-components';

export default defineComponent({
    components: {
        UiH2,
        UiText,
        UiInputGroup,
        UiTextInput,
        UiButton,
        UiLayout
    },
    setup() {
        const login = ref("");
        const password = ref("");
        const router = useRouter();

        async function submitLogin() {
            try {
                const result = await apiClient.login({ login: login.value, password: password.value });

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
            }
            catch (e) {
                // TODO: proper error handling
                alert(e.message);
            }
        }

        return {
            login,
            password,
            submitLogin
        }
    },
})
</script>
