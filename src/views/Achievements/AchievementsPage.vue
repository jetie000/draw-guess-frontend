<script setup lang="ts">
import { UserApi } from '@/api/user/user.api';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import medalImg from '@/assets/achievements/medal.png';
import crownImg from '@/assets/achievements/crown.png';
import trophyImg from '@/assets/achievements/trophy.png';
import AchievementCard from './components/AchievementCard.vue';
import type { AchievementsTypeIds } from '@/typings/enums/achievements';

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
      return trophyImg;
    case 3:
      return crownImg;
    default:
      return medalImg;
  }
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-xl text-center font-bold mb-5">My Achievements</h1>
    <div
      v-if="isLoading"
      class="w-full flex"
    >
      <Spinner
        :size="8"
        class="mx-auto"
        color="blue-dark"
      />
    </div>
    <div
      v-else-if="data"
      class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 max-w-[1100px] mx-auto"
    >
      <AchievementCard
        v-for="(achievement, index) in data.achievements"
        :key="achievement.id"
        :progress="data.progressByType[(index + 1) as AchievementsTypeIds]"
        :achievement="achievement"
        :level-img="imgByLevel(achievement.level)"
      />
    </div>
  </div>
</template>
