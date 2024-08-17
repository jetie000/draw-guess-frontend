<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderMain from './components/Header/HeaderMain.vue'
</script>

<template>
  <div>
    <HeaderMain />
    <RouterView />
  </div>
</template>
