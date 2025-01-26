<script setup lang="ts">
import Spinner from './Spinner.vue';
</script>

<template>
  <div class="fixed top-1/2 left-1/2 w-16 h-16">
    <Spinner
      :size="16"
      color="blue-dark"
    />
  </div>
</template>
