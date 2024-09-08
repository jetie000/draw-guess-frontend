<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid';

withDefaults(
  defineProps<{
    title: string;
    isOpen: boolean;
    backdropDismiss?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    backdropDismiss: true,
    size: 'md'
  }
);

defineEmits(['close']);
</script>

<template>
  <div class="relative">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="flex justify-center items-center fixed inset-0 bg-black bg-opacity-35 transition-opacity duration-200"
        @click="backdropDismiss && $emit('close')"
      >
        <div
          class="flex flex-col bg-white border border-blue-dark rounded-xl shadow-lg text-left max-xsm:min-w-[calc(100%-1rem)] lg:max-w-lg sm:max-w-md mx-4 max-xsm:mx-2"
          :class="`modal-${size}`"
          @click.stop
        >
          <div class="flex p-2 ps-4">
            <h1 class="text-2xl me-4">{{ title }}</h1>
            <button
              class="w-8 h-8 ms-auto shrink-0 hover:bg-blue-dark hover:bg-opacity-20 transition-colors rounded-full"
              @click="$emit('close')"
            >
              <XMarkIcon />
            </button>
          </div>
          <hr />
          <div class="p-3 px-4">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
