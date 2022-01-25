import { ref } from "vue";
import { IUser } from "../services";

const user = ref<IUser>();

export function useUser() {
    return {
        user,
        exists: !!user.value
    };
}

export function clearSession() {
    user.value = undefined;
}