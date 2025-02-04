<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import GameButtons from './components/GameButtons.vue';
import ParticipatingGames from './components/ParticipatingGame.vue';
import { GameApi } from '@/api/game/game.api';

const { isFetching, data } = useQuery({
  queryKey: ['participating-games'],
  queryFn: () => GameApi.getParticipatingGames()
});
</script>

<template>
  <main class="bg-yellow-secondary flex flex-col items-center">
    <div class="flex flex-col items-center">
      <GameButtons
        class="mt-12 mb-6"
        :is-participating="(data && data?.length > 0) || isFetching"
      />
      <ParticipatingGames />
    </div>
  </main>
</template>
