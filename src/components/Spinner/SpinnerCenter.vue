<script setup lang="ts">
import Spinner from './Spinner.vue';
</script>

<template>
  <div class="fixed top-1/2 left-1/2 w-20 h-20">
    <Spinner
      :size="16"
      color="blue-dark"
    />
  </div>
</template>
