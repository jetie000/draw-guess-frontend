<script setup lang="ts">
import { ref } from 'vue';

withDefaults(
  defineProps<{
    triggerWrapperClass?: string;
    align?: 'left' | 'right';
  }>(),
  {
    align: 'left'
  }
);

const isMenuOpen = ref(false);

defineExpose({
  hideMenu: () => (isMenuOpen.value = false)
});
</script>

<template>
  <div class="relative">
    <div
      :class="triggerWrapperClass"
      @click="isMenuOpen = true"
    >
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
        class="absolute bottom-0 z-10 translate-y-[calc(100%+0.25rem)] transition-opacity duration-100"
        :class="{
          'right-0': align === 'right',
          'left-0': align === 'left'
        }"
        @click.stop
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
