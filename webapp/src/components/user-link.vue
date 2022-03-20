<template>
    <UiLink :to="{ name: 'admin-member-details', params: { id: user._id } }">
        {{ user.name }}
    </UiLink>
</template>
<script lang="ts" setup>
import {
    UiLink
} from "../ui-components";

interface IUserData {
    _id: string;
    name: string;
}

defineProps<{ user: IUserData }>();
</script>