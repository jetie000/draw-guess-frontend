<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import trophyImg from '@/assets/achievements/trophy.png';
import coinImg from '@/assets/coin.svg';

const { isErrorModalOpen, isLevelModalOpen, isAchievementModalOpen, achievements } =
  storeToRefs(useModalStore());

const label = computed(() =>
  achievements.value.length === 1
    ? "You've received a new achievement!"
    : "You've received new achievements!"
);
</script>

<template>
  <Modal
    title="Congratulations!"
    backdrop-dismiss
    size="sm"
    :is-open="!isErrorModalOpen && !isLevelModalOpen && isAchievementModalOpen"
    @close="isAchievementModalOpen = false"
  >
    <div class="flex justify-between items-center gap-4 mb-4">
      <div class="text-xl font bold mb-4 text-center max-w-36">{{ label }}</div>
      <img
        :src="trophyImg"
        class="h-32 mx-auto"
        alt="Cup"
      />
    </div>
    <div
      v-for="achievement in achievements"
      :key="achievement.id"
      class="flex flex-col"
    >
      <hr class="-mx-4" />
      <div class="mt-3 flex justify-center gap-2">
        <div class="font-bold text-blue-dark">{{ achievement.type.name }}</div>
        <div>-</div>
        <div>Level {{ achievement.level }}</div>
      </div>
      <div class="my-3 flex gap-1 items-center max-w-80">
        <div class="text-sm text-gray-secondary text-center">
          {{ achievement.type.description }}
        </div>
        <div class="font-bold text-yellow-950 ms-2">+{{ achievement.money }}</div>
        <img
          :src="coinImg"
          class="w-10 h-10"
          alt="coin"
        />
      </div>
    </div>
  </Modal>
</template>
