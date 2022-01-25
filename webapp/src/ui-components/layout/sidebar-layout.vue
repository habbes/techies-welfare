<template>
    <div class="flex-1 flex items-stretch px-5 py-5 text-sm">
        <slot name="sidebar"></slot>
        <div class="flex-1 py-8 px-20">
            <slot></slot>
        </div>
    </div>
</template>