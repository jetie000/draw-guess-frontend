<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl';
    theme?: 'primary' | 'secondary' | 'danger';
    isRounded?: boolean;
  }>(),
  {
    size: 'md',
    theme: 'primary',
    isRounded: false
  }
);

const themeClasses = {
  primary: 'bg-blue-dark hover:bg-blue-light text-white',
  secondary: 'bg-yellow-200 hover:bg-yellow-100 text-blue-dark border border-blue-dark',
  danger: 'bg-red-500 hover:bg-red-600 text-white border border-blue-dark'
};
</script>

<template>
  <button
    :class="`flex justify-center items-center ${themeClasses[theme]} ${isRounded ? 'rounded-full p-2' : `rounded-${size} px-3 py-2.5`}  text-${size} font-semibold transition-colors`"
  >
    <slot />
  </button>
</template>
