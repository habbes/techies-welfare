<template>
     <div>
        <div class="flex gap-3">
            <router-link :to="{ name: 'admin-payments' }">&lt;</router-link> <ui-h2>Record payment</ui-h2>
        </div>
        <div>
            <form>
                <ui-text-input label="User's phone"></ui-text-input>
            </form>
        </div>
     </div>
</template>