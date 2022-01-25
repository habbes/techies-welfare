<template>
    <div class="bg-dark rounded-md w-32 shadow-sm text-white py-5 flex flex-col items-center justify-between">
        <div class="flex flex-col gap-6">
            <slot></slot>
        </div>
        <div>
            <slot name="footer"></slot>
        </div>
    </div>
</template>