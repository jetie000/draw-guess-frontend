<script setup lang="ts">
defineModel<string>();
</script>

<template>
  <input
    :value="modelValue"
    class="w-full rounded-md py-1.5 px-3 border border-gray-main placeholder:text-gray-400 leading-4"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
