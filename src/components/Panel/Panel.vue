<script setup lang="ts">
withDefaults(defineProps<{ noPadding?: boolean }>(), {
  noPadding: false
});
</script>

<template>
  <div
    class="bg-yellow-200 border border-blue-light rounded-lg"
    :class="{ 'p-4': !noPadding, 'p-0': noPadding }"
  >
    <slot />
  </div>
</template>
