<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import NewGameModal from './NewGameModal.vue';
import JoinGameModal from './JoinGameModal.vue';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';

const props = defineProps<{
  isParticipating: boolean;
}>();

const isNewModalOpen = ref(false);
const isJoinModalOpen = ref(false);

const toggleModal = (callback: Function) => {
  if (props.isParticipating) {
    useAlertStore().showAlert('You are already in a game', AlertTypes.Warning);
    return;
  }
  callback();
};

const setIsOpenNewModal = (isOpen: boolean) => {
  isNewModalOpen.value = isOpen;
};

const setIsOpenJoinModal = (isOpen: boolean) => {
  isJoinModalOpen.value = isOpen;
};

const buttons = [
  {
    title: 'Create Game',
    onClick: () => toggleModal(() => setIsOpenNewModal(true)),
    icon: PlusIcon
  },
  {
    title: 'Join Game',
    onClick: () => toggleModal(() => setIsOpenJoinModal(true)),
    icon: ArrowRightEndOnRectangleIcon
  }
];
</script>

<template>
  <div>
    <div class="flex gap-4 max-xsm:flex-col">
      <button
        v-for="{ title, onClick, icon } in buttons"
        :key="title"
        class="aspect-square w-48 border rounded-2xl bg-yellow-200 hover:bg-yellow-100 transition-colors"
        :class="{ 'opacity-70': isParticipating }"
        @click="onClick"
      >
        <component
          :is="icon"
          class="w-16 h-16 mx-auto my-4"
        />
        <span class="font-bold text-xl">{{ title }}</span>
      </button>
    </div>

    <NewGameModal
      :is-new-modal-open="isNewModalOpen"
      @close="setIsOpenNewModal(false)"
    />
    <JoinGameModal
      :is-join-modal-open="isJoinModalOpen"
      @close="setIsOpenJoinModal(false)"
    />
  </div>
</template>
