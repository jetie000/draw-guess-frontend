<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/16/solid'
</script>
<template>
  <header class="text-blue p-2 flex justify-center items-center">
    <h1 class="ml-auto">
      Draw <img class="w-6 h-6 inline" src="@/assets/duck-icon.svg" alt="" /> Guess
    </h1>
    <button
      class="flex items-center gap-1 ml-auto mr-5 hover:bg-blue hover:text-white transition-all pl-3 pr-3 pt-1 pb-1 rounded-full"
    >
      <span>Log in</span> <ArrowRightIcon class="inline w-5 h-5" />
    </button>
  </header>
</template>

<style scoped></style>
