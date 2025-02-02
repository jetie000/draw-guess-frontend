<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>(), {
  size: 'md'
});
</script>

<template>
  <button
    :class="`flex justify-center rounded-${size} bg-blue-dark px-3 py-2.5 text-${size} font-semibold text-white hover:bg-blue-light transition-colors`"
  >
    <slot />
  </button>
</template>
