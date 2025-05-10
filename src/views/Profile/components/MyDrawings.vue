<script setup lang="ts">
import { DrawingApi } from '@/api/drawing/drawing.api';
import { QueryKeys } from '@/api/query-keys';
import DrawingCard from '@/components/Drawing/DrawingCard.vue';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';

const { isLoading, data, isError, error } = useQuery({
  queryKey: [QueryKeys.Drawings],
  queryFn: DrawingApi.getMyDrawings
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error);
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-3 relative">
    <h3 class="font-bold text-lg">My Drawings</h3>
    <SpinnerCenter v-if="isLoading" />
    <div
      v-else-if="data?.length"
      class="grid cols grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3"
    >
      <DrawingCard
        v-for="drawing in data"
        :key="drawing.id"
        :drawing="drawing"
        :players="[]"
        hide-player
      />
    </div>
    <div
      class="text-center"
      v-else
    >
      Play games to see your drawings!
    </div>
  </div>
</template>
