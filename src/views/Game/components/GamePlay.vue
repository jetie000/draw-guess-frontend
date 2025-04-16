<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import GameCanvas from './GameCanvas.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import paper from 'paper';
import GamePlayInfo from './GamePlayInfo.vue';
import GameDrawingOptions from './GameDrawingOptions.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { DrawingApi } from '@/api/drawing/drawing.api';
import type { DrawingPart } from '@/api/drawing/drawing.api.interface';
import { breakSecondsNumber } from '@/typings/enums/game';
import { formatSeconds } from '@/helpers/datetime';
import { socket } from '@/helpers/socket';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import GameDrawingMessages from './GameDrawingMessages.vue';
import type { Player } from '@/typings/interfaces/player.interface';

const props = defineProps<{ game: Game; user: Profile }>();

const queryClient = useQueryClient();

const queryData = useQuery({
  queryKey: ['drawing', props.game.id],
  queryFn: () => DrawingApi.getCurrentGameDrawing(props.game.id)
});

watch(queryData.isFetching, () => {
  if (queryData.isError.value) {
    useErrorModalStore().showModal(queryData.error.value);
  }
});

const path = ref<paper.Path>();

const remainingTime = ref(props.game.roundDuration);

onMounted(() => {
  socket.on('timePassed', (time: number) => {
    const round = Math.floor(time / (props.game.roundDuration + breakSecondsNumber)) + 1;
    if (round !== props.game.currentRound) {
      queryClient.setQueryData(['game', String(props.game.id)], {
        ...props.game,
        currentRound: round
      });
    }
    if (time % (props.game.roundDuration + breakSecondsNumber) === 0) {
      queryClient.invalidateQueries({ queryKey: ['drawing', props.game.id] });
    }
    remainingTime.value =
      props.game.roundDuration - (time % (props.game.roundDuration + breakSecondsNumber));
  });

  socket.on('updatedPlayers', (players: Player[]) => {
    queryClient.setQueryData(['game', String(props.game.id)], {
      ...props.game,
      players
    });
  });

  socket.on('gameEnded', ({ endDate }: { endDate: string }) => {
    queryClient.setQueryData(['game', String(props.game.id)], {
      ...props.game,
      endDate
    });
    queryClient.invalidateQueries({ queryKey: ['public-games'] });
    queryClient.invalidateQueries({ queryKey: ['participating-games'] });
  });
});

onUnmounted(() => {
  socket.off('timePassed');
  socket.off('updatedPlayers');
  socket.off('gameEnded');
});

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
      :is-break="remainingTime <= 0"
      @add-part="handleAddPart"
    />
    <div
      class="flex gap-3 flex-col max-lg:justify-between max-lg:grid max-lg:grid-cols-2 max-sm:flex max-sm:flex-col max-sm:gap-1"
    >
      <GamePlayInfo :game="game" />
      <Panel>
        <div class="text-lg font-bold text-center">Round {{ game.currentRound }}</div>
        <div class="text-2xl text-center mt-2">
          {{ formatSeconds(remainingTime >= 0 ? remainingTime : 0) }}
        </div>
      </Panel>
      <template v-if="user.id === game.players[currentPlayerIndex].user.id">
        <Panel class="flex flex-col gap-3 max-xsm:w-full text-center">
          <span class="text-gray-secondary">Your word</span>
          <span class="font-bold text-xl">{{ queryData.data?.value?.word?.word || '-' }}</span>
        </Panel>
        <GameDrawingOptions :path="path" />
      </template>
      <template v-if="user.id !== game.players[currentPlayerIndex].user.id">
        <GameDrawingMessages
          :query-data="queryData"
          :game="game"
        />
      </template>
    </div>
  </div>
</template>
