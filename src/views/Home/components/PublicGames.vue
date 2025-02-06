<script setup lang="ts">
import { GameApi } from '@/api/game/game.api';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import GameCard from './GameCard.vue';

const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: ['public-games'],
  queryFn: () => GameApi.getPublicGames()
});

const { data: participatingGames } = useQuery({
  queryKey: ['participating-games'],
  queryFn: () => GameApi.getParticipatingGames()
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
});
</script>

<template>
  <div
    v-if="isSuccess && data?.length"
    class="flex flex-col w-full gap-3"
  >
    <h2 class="text-2xl font-bold text-center mt-3">Public</h2>
    <GameCard
      v-for="game in data"
      :key="game.id"
      :game="game"
      :is-joined-this="false"
      :is-joined="!!participatingGames && participatingGames?.length > 0"
    />
  </div>
</template>
