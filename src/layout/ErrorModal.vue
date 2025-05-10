<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modal/modalStore';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal/Modal.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';

const router = useRouter();
const { isErrorModalOpen, messageError } = storeToRefs(useModalStore());
const { hideErrorModal } = useModalStore();

const handleGoHome = () => {
  hideErrorModal();
  router.push({ name: 'Home' });
};
</script>

<template>
  <Modal
    title="Network error"
    :size="'sm'"
    :is-open="isErrorModalOpen"
    :backdrop-dismiss="false"
    no-dismiss-button
  >
    <p class="mt-4 mb-8">{{ messageError }}</p>
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
