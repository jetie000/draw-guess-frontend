<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';
import { watch } from 'vue';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';

const route = useRoute();
const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: ['game', route.params.id],
  queryFn: () => GameApi.getGame(Number(route.params.id))
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
});
</script>

<template>
  <div>
    <SpinnerCenter v-if="isFetching" />
    <div v-else-if="isSuccess">
      {{ JSON.stringify(data) }}
    </div>
  </div>
</template>
