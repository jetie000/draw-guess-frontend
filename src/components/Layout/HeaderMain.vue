<script setup lang="ts">
import duckIcon from '@/assets/duck-icon.svg';
import { ArrowRightIcon } from '@heroicons/vue/16/solid';
</script>

<template>
  <header class="text-blue bg-white p-2 h-12 flex justify-center sticky top-0 border-b">
    <div class="container flex justify-center items-center flex-grow px-4">
      <h1 class="cursor-pointer" @click="$router.push('/')">
        Draw <img class="w-6 h-6 inline" :src="duckIcon" alt="Logo" /> Guess
      </h1>
      <button
        class="flex items-center gap-1 ml-auto hover:bg-blue hover:text-white transition-all px-3 py-1 rounded-full"
      >
        <RouterLink to="/login">Log in</RouterLink> <ArrowRightIcon class="inline w-5 h-5" />
      </button>
    </div>
  </header>
</template>
