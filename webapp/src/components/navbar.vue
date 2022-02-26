<template>
  <nav class="flex justify-between items-center bg-white shadow-sm h-14 px-4">
    <div class="flex gap-3">
      <router-link to="/"
        ><img src="/img/logo.png" alt="Logo" style="width: 100px"
      /></router-link>
    </div>
    <div class="flex gap-3">
      <UiDropdown v-if="user">
        <template #activator>
          <div class="flex items-center">
            <div class="flex-col mr-3">
              <div class="text-base">{{ user.name }}</div>
              <div class="text-sm text-secondary-light">
                {{ user.roles[0] }}
              </div>
            </div>
            <span class="text-secondary-light"
              ><ui-chevron-down-icon
                class="cursor-pointer"
                width="18"
                height="18"
            /></span>
          </div>
        </template>
        <UiDropdownItem> My account </UiDropdownItem>
        <UiDropdownItem :route="{ name: 'admin' }">
          Admin dashboard
        </UiDropdownItem>
        <UiDropdownItem @click="logout"> Sign out </UiDropdownItem>
      </UiDropdown>
    </div>
  </nav>
</template>
<script lang="ts">
import { defineComponent, PropType, onMounted } from "vue";
import { useRouter } from "vue-router";
import { IUser } from "../services";
import { clearSession } from "../store";
import { authService } from "../auth";
import {
  UiDropdown,
  UiDropdownItem,
  UiChevronDownIcon,
} from "../ui-components";

export default defineComponent({
  components: { UiDropdown, UiDropdownItem, UiChevronDownIcon },
  props: {
    user: Object as PropType<IUser>
  },
  setup() {
    const router = useRouter();

    async function logout() {
      clearSession();
      await authService.logout();
      // TODO: ideally we should not manually redirect to login
      // since authService.logout() should handle that
      // but because of a bug, that tends to fail
      router.push({ name: "login" });
    }

    return {
      logout
    }
  },
});
</script>