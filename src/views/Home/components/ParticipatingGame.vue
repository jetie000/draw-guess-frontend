<script setup lang="ts">
import Spinner from '@/components/Spinner/Spinner.vue';
import GameJoinCard from './GameJoinCard.vue';
import type { Game } from '@/api/game/game.api.interface';

defineProps<{ participatingGames: Game[] | undefined; isFetching: boolean }>();
</script>

<template>
  <div class="flex w-full">
    <Spinner
      class="mx-auto"
      :size="8"
      color="blue-dark"
      v-if="isFetching"
    />
    <div
      v-else-if="participatingGames?.length"
      class="flex flex-col w-full gap-3"
    >
      <hr class="my-3" />
      <h2 class="text-2xl font-bold text-center">Participating</h2>
      <GameJoinCard
        :game="participatingGames[0]"
        :is-joined-this="true"
        :is-joined="true"
      />
      <hr class="my-3" />
    </div>
  </div>
</template>
