<template>
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div class="bg-white rounded-xl w-full max-w-sm p-6 relative">
            <button
                @click="$emit('close')"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                ✕
            </button>
            <h2 class="text-lg font-bold text-gray-800 mb-4">
                <slot name="title" />
            </h2>
            <div>
                <slot />
            </div>
        </div>
    </div>
</template>
