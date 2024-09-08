<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import NewGameModal from './NewGameModal.vue';
import JoinGameModal from './JoinGameModal.vue';

const isNewModalOpen = ref(false);
const isJoinModalOpen = ref(false);

const toggleNewModal = () => {
  isNewModalOpen.value = !isNewModalOpen.value;
};

const toggleJoinModal = () => {
  isJoinModalOpen.value = !isJoinModalOpen.value;
};

const buttons = [
  {
    title: 'Create Game',
    onClick: toggleNewModal,
    icon: PlusIcon
  },
  {
    title: 'Join Game',
    onClick: toggleJoinModal,
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
      @toggle="toggleNewModal"
    />
    <JoinGameModal
      :is-join-modal-open="isJoinModalOpen"
      @toggle="toggleJoinModal"
    />
  </div>
</template>
