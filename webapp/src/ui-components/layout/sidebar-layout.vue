<template>
    <div class="flex-1 flex items-stretch px-5 py-5 text-sm">
        <div class="pr-5 flex items-stretch">
            <slot name="sidebar"></slot>
        </div>
        <div class="flex-1">
            <slot></slot>
        </div>
    </div>
</template>