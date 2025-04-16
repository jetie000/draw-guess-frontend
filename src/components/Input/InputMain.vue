<script setup lang="ts">
defineModel<string>();

withDefaults(
  defineProps<{
    notFullWidth?: boolean;
  }>(),
  {
    notFullWidth: false
  }
);
</script>

<template>
  <input
    :value="modelValue"
    class="rounded-md py-1.5 px-3 border border-gray-main placeholder:text-gray-400 leading-4"
    :class="{ 'w-full': !notFullWidth }"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
