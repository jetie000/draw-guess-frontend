<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Modal from './Modal/Modal.vue';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useRouter } from 'vue-router';
import ButtonMain from './Button/ButtonMain.vue';

const router = useRouter();
const { isModalOpen, message } = storeToRefs(useErrorModalStore());
const { hideModal } = useErrorModalStore();

const handleGoHome = () => {
  hideModal();
  router.push({ name: 'Home' });
};
</script>

<template>
  <Modal
    title="Network error"
    :size="'sm'"
    :is-open="isModalOpen"
    :backdrop-dismiss="false"
    no-dismiss-button
  >
    <p class="mt-4 mb-8">{{ message }}</p>
    <div class="flex gap-3 justify-evenly">
      <ButtonMain
        class="grow"
        @click="handleGoHome"
      >
        Home page
      </ButtonMain>
      <ButtonMain
        class="grow"
        @click="$router.go(0)"
      >
        Refresh page
      </ButtonMain>
    </div>
  </Modal>
</template>
