<script setup lang="ts">
import { UserApi } from '@/api/user/user.api';
import Panel from '@/components/Panel/Panel.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import medalImg from '@/assets/achievements/medal.png';
import crownImg from '@/assets/achievements/crown.png';
import trophyImg from '@/assets/achievements/trophy.png';

const { data, error, isError, isLoading } = useQuery({
  queryKey: ['achievements'],
  queryFn: () => UserApi.getAchievements()
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

const imgByLevel = (level: number) => {
  switch (level) {
    case 2:
      return crownImg;
    case 3:
      return trophyImg;
    default:
      return medalImg;
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl text-center font-bold mb-5">My Achievements</h1>
    <Spinner v-if="isLoading" />
    <div
      v-else-if="data"
      class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 max-w-[1100px] mx-auto"
    >
      <Panel
        v-for="achievement in data"
        :key="achievement.id"
      >
        <img
          class="h-40 mx-auto mb-3"
          :class="{ grayscale: achievement.level === 0 }"
          :src="imgByLevel(achievement.level)"
          :alt="`level ${achievement.level}`"
        />
        <div class="text-center text-lg font-bold">{{ achievement.type.name }}</div>
        <div class="flex justify-around gap-2 mt-3">
          <div
            v-for="(amount, index) in [
              achievement.type.level1Amount,
              achievement.type.level2Amount,
              achievement.type.level3Amount
            ]"
            :key="amount"
            class="text-center relative"
          >
            <div
              v-if="index === achievement.level - 1"
              class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-blue-dark border-t-[10px] border-e-[10px] border-s-[10px] border-s-transparent border-e-transparent"
            />
            <div :class="{ 'font-bold text-red-primary': index === achievement.level - 1 }">
              {{ index + 1 }} lvl
            </div>
            <div class="mt-2 font-bold">{{ amount }}</div>
          </div>
        </div>
      </Panel>
    </div>
  </div>
</template>
