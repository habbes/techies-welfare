import { ref } from "vue";
import { IUser } from "../services";

const user = ref<IUser>();
const accountSummary = ref<{ arrears: number, totalContribution: number }>();

export function useUser() {
    return {
        user,
        accountSummary,
        exists: !!user.value,
        setUser(value: IUser) {
            user.value = value;
            accountSummary.value = undefined;
        },
        updateAccountSummary(value: { arrears: number, totalContribution: number }) {
            accountSummary.value = value;
        }
    };
}

export function clearSession() {
    user.value = undefined;
    accountSummary.value = undefined;
}