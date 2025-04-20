<script setup lang="ts">
import { GameApi } from '@/api/game/game.api';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import GameCard from './GameCard.vue';
import { QueryKeys } from '@/api/query-keys';

const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: [QueryKeys.ParticipatingGames],
  queryFn: () => GameApi.getParticipatingGames()
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
});
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
      v-else-if="isSuccess && data?.length"
      class="flex flex-col w-full gap-3"
    >
      <hr class="my-3" />
      <h2 class="text-2xl font-bold text-center">Participating</h2>
      <GameCard
        :game="data[0]"
        :is-joined-this="true"
        :is-joined="true"
      />
      <hr class="my-3" />
    </div>
  </div>
</template>
