<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    isOpen: boolean;
    backdropDismiss?: boolean;
    noDismissButton?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    backdropDismiss: true,
    noDismissButton: false,
    size: 'md'
  }
);

const isMouseDownInner = ref(false);

const handleClickBackdrop = () => {
  if (props.backdropDismiss && isMouseDownInner.value) {
    isMouseDownInner.value = false;
    return;
  }
  emit('close');
};

const handleCloseByButton = () => {
  isMouseDownInner.value = false;
  emit('close');
};

const emit = defineEmits(['close']);
</script>

<template>
  <div class="relative">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="flex justify-center items-center fixed z-10 inset-0 bg-black bg-opacity-35 transition-opacity duration-200"
        @click="handleClickBackdrop"
      >
        <div
          class="flex flex-col bg-white border border-blue-dark rounded-xl shadow-lg text-left max-xsm:min-w-[calc(100%-1rem)] lg:max-w-lg sm:max-w-md mx-4 max-xsm:mx-2 max-h-[calc(100%-2rem)]"
          :class="`modal-${size}`"
          @click.stop
          @mousedown="isMouseDownInner = true"
        >
          <div class="flex p-2 ps-4">
            <h1 class="text-2xl me-4">{{ title }}</h1>
            <button
              v-if="!noDismissButton"
              class="w-8 h-8 ms-auto shrink-0 hover:bg-blue-dark hover:bg-opacity-20 transition-colors rounded-full"
              @click="handleCloseByButton"
            >
              <XMarkIcon />
            </button>
          </div>
          <hr />
          <div class="p-3 px-4 overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
