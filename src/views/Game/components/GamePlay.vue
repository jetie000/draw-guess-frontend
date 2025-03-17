<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import GameCanvas from './GameCanvas.vue';
import { computed, ref } from 'vue';
import paper from 'paper';
import GamePlayInfo from './GamePlayInfo.vue';
import GameDrawingOptions from './GameDrawingOptions.vue';
import { dataTagErrorSymbol, useQuery, useQueryClient } from '@tanstack/vue-query';
import { DrawingApi } from '@/api/drawing/drawing.api';
import type { DrawingPart } from '@/api/drawing/drawing.api.interface';

const props = defineProps<{ game: Game; user: Profile }>();

const queryClient = useQueryClient();

const queryData = useQuery({
  queryKey: ['drawing', props.game.id],
  queryFn: () => DrawingApi.getCurrentGameDrawing(props.game.id)
});

const path = ref<paper.Path>();

const currentPlayerIndex = computed(() =>
  props.game.currentRound % props.game.players.length === 0
    ? props.game.players.length - 1
    : (props.game.currentRound % props.game.players.length) - 1
);

const handleAddPart = (part: DrawingPart) => {
  if (!queryData.data.value) {
    return;
  }
  queryClient.setQueryData(['drawing', props.game.id], {
    ...queryData.data.value,
    drawingParts: [...queryData.data.value.drawingParts, part]
  });
};
</script>

<template>
  <div class="flex justify-center gap-3 p-5 max-lg:flex-col max-md:p-3 max-sm:p-1 max-sm:gap-1">
    <GameCanvas
      :path="path"
      :game="game"
      :user="user"
      :drawing-data="queryData"
      :current-player-index="currentPlayerIndex"
      @add-part="handleAddPart"
    />
    <div
      class="flex gap-3 flex-col max-lg:justify-between max-lg:grid max-lg:grid-cols-2 max-sm:flex max-sm:flex-col max-sm:gap-1"
    >
      <GamePlayInfo :game="game" />
      <template v-if="user.id === game.players[currentPlayerIndex].user.id">
        <Panel class="flex flex-col gap-3 max-xsm:w-full text-center">
          <span class="text-gray-secondary">Your word</span>
          <span class="font-bold text-xl">{{ queryData.data?.value?.word?.word || '-' }}</span>
        </Panel>
        <GameDrawingOptions :path="path" />
      </template>
    </div>
  </div>
</template>
