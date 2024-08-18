<script setup lang="ts">
import githubIcon from '@/assets/github.svg'
</script>
<template>
  <footer class="flex justify-center items-center h-8 text-brown text-xs">
    <span>Created by</span>
    <img :src="githubIcon" alt="Github" class="mx-1 size-4" />
    <a class="underline" href="https://github.com/jetie000">jetie000</a>
  </footer>
</template>

<style scoped></style>
