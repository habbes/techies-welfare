import { createToast, ToastType } from "mosha-vue-toastify";

export function showError(message: string) {
    showMessage(message, 'danger');
}

export function showSuccess(message: string) {
    showMessage(message, 'success');
}

export function showInfo(message: string) {
    showMessage(message, 'info');
}

function showMessage(message: string, type: ToastType) {
    createToast(message, { type, position: 'top-center' });
}