<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>

<template>
  <div class="relative">
    <div @click="isMenuOpen = true">
      <slot name="trigger" />
    </div>
    <div
      v-if="isMenuOpen"
      class="bg-transparent fixed inset-0 z-10"
      @click.stop="isMenuOpen = false"
    />
    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        class="absolute left-0 z-10 translate-y-1 transition-opacity duration-100"
        @click.stop
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
