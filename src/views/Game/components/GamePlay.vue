<script setup lang="ts">
import type { Game, GameDrawing } from '@/api/game/game.api.interface';
import type { ProfileExtended } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import GameCanvas from './GameCanvas.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import paper from 'paper';
import GamePlayInfo from './GamePlayInfo.vue';
import GameDrawingOptions from './GameDrawingOptions.vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { DrawingApi } from '@/api/drawing/drawing.api';
import type { DrawingPart } from '@/api/drawing/drawing.api.interface';
import { breakSecondsNumber, noGuessesSecondsNumber } from '@/typings/enums/game';
import { formatSeconds } from '@/helpers/datetime';
import { socket } from '@/helpers/socket';
import { useModalStore } from '@/stores/modal/modalStore';
import GameDrawingMessages from './GameDrawingMessages.vue';
import type { Player } from '@/typings/interfaces/player.interface';
import GameScoreModal from './GameScoreModal.vue';
import { QueryKeys } from '@/api/query-keys';
import { SocketEventKeys } from '@/helpers/socket/event-keys';
import { getLevelAndProgressByExp } from '@/helpers/game';
import { useSettingsStore } from '@/stores/settingsStore';
import timeSound from '@/assets/sounds/time.wav';
import levelUpAudio from '@/assets/sounds/level-up.wav';
import { getMoneyAmountForLevelUp } from '@/helpers/account';
import GameDrawingWord from './GameDrawingWord.vue';
import { Prices } from '@/typings/enums/prices';

const props = defineProps<{ game: Game; user: ProfileExtended }>();

const queryClient = useQueryClient();
const { showErrorModal, showLevelModal } = useModalStore();

const queryData = useQuery({
  queryKey: [QueryKeys.Drawing, props.game.id],
  queryFn: () => DrawingApi.getCurrentGameDrawing(props.game.id)
});

watch(queryData.isFetching, () => {
  if (queryData.isError.value) {
    showErrorModal(queryData.error.value);
  }
});

const path = ref<paper.Path>();

const remainingTime = ref(props.game.roundDuration);

onMounted(() => {
  socket.on(SocketEventKeys.TimePassed, (time: number) => {
    const round = Math.floor(time / (props.game.roundDuration + breakSecondsNumber)) + 1;
    if (round !== props.game.currentRound) {
      queryClient.setQueryData([QueryKeys.Game, String(props.game.id)], {
        ...props.game,
        currentRound: round
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Drawing, props.game.id] });
    }
    remainingTime.value =
      props.game.roundDuration - (time % (props.game.roundDuration + breakSecondsNumber));
    if (remainingTime.value > 0 && remainingTime.value <= 5) {
      useSettingsStore().playAudio(timeSound);
    }
  });

  socket.on(SocketEventKeys.UpdatedPlayers, (players: Player[]) => {
    queryClient.setQueryData([QueryKeys.Game, String(props.game.id)], {
      ...props.game,
      players
    });
  });

  socket.on(
    SocketEventKeys.GameEnded,
    ({ endDate, drawings }: { endDate: string; drawings: GameDrawing[] }) => {
      queryClient.setQueryData([QueryKeys.Game, String(props.game.id)], {
        ...props.game,
        endDate,
        drawings
      });
      const myPoints = props.game.players.find(
        (player) => player.user.id === props.user.id
      )?.points;
      if (myPoints) {
        const currentLevel = getLevelAndProgressByExp(props.user.experience + myPoints).level;
        const prevLevel = getLevelAndProgressByExp(props.user.experience).level;
        let moneyEarned = 0;
        if (currentLevel !== prevLevel) {
          moneyEarned = getMoneyAmountForLevelUp(currentLevel);
          showLevelModal(currentLevel, moneyEarned);
          useSettingsStore().playAudio(levelUpAudio);
        }
        queryClient.setQueryData([QueryKeys.Profile], {
          ...props.user,
          experience: props.user.experience + myPoints,
          money: props.user.money + moneyEarned
        });
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PublicGames] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ParticipatingGames] });
    }
  );

  socket.on(SocketEventKeys.DrawingWordChanged, () => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.Drawing, props.game.id] });
  });
});

onUnmounted(() => {
  socket.off(SocketEventKeys.TimePassed);
  socket.off(SocketEventKeys.UpdatedPlayers);
  socket.off(SocketEventKeys.GameEnded);
  socket.off(SocketEventKeys.DrawingWordChanged);
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
  queryClient.setQueryData([QueryKeys.Drawing, props.game.id], {
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
        <GameDrawingWord
          :game-id="game.id"
          :word="queryData.data.value?.word"
          :is-can-change="
            user.money > Prices.ChangeWord &&
            remainingTime > game.roundDuration - noGuessesSecondsNumber
          "
          :seconds-remaining-to-change="remainingTime - game.roundDuration + noGuessesSecondsNumber"
        />
        <GameDrawingOptions :path="path" />
      </template>
      <template v-else>
        <GameDrawingMessages
          :query-data="queryData"
          :game="game"
          :is-disabled-sending="remainingTime >= game.roundDuration - noGuessesSecondsNumber"
        />
      </template>
    </div>
    <GameScoreModal
      :players="game.players"
      :round="game.currentRound"
      :is-open="remainingTime <= 0"
    />
  </div>
</template>
