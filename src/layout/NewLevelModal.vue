<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { storeToRefs } from 'pinia';
import confettiJson from '@/assets/confetti.json';
import { Vue3Lottie } from 'vue3-lottie';
import duckIcon from '@/assets/duck-icon.svg';

const { isLevelModalOpen, isErrorModalOpen, level } = storeToRefs(useModalStore());
</script>

<template>
  <Modal
    title="Congratulations!"
    backdrop-dismiss
    size="sm"
    :is-open="!isErrorModalOpen && isLevelModalOpen"
    @close="isLevelModalOpen = false"
  >
    <div class="text-xl font bold mb-12 text-center">You've got a level up!</div>
    <div class="text-5xl font bold text-center mb-14 text-blue-dark">Level {{ level }}</div>
    <Vue3Lottie
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] z-20 pointer-events-none"
      :animation-data="confettiJson"
      :height="600"
      :width="600"
    />
    <div class="flex items-center">
      <div class="px-3 py-1 rounded-lg border-2 border-blue-dark mx-auto">
        Nice job! <br />
        Keep it forward!
      </div>
      <div
        class="w-0 h-0 border-blue-dark border-t-[20px] border-b-[20px] border-s-[20px] border-t-transparent border-b-transparent scale-x-150"
      >
        <div
          class="w-0 h-0 relative top-[-15px] right-[18px] border-white border-t-[15px] border-b-[15px] border-s-[15px] border-t-transparent border-b-transparent"
        />
      </div>
      <img
        class="w-10 h-10 ml-auto"
        :src="duckIcon"
        alt="duck"
      />
    </div>
  </Modal>
</template>
