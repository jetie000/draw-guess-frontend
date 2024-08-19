<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderMain from './components/Layout/HeaderMain.vue';
import FooterMain from './components/Layout/FooterMain.vue';
</script>

<template>
  <div>
    <HeaderMain />
    <div class="min-h-[calc(100vh-3rem)] bg-yellow-secondary text-blue">
      <main class="container flex flex-col mx-auto min-h-[calc(100vh-5rem)]">
        <RouterView />
      </main>
      <FooterMain />
    </div>
  </div>
</template>
