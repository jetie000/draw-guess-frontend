<script setup lang="ts">
import { DrawingApi } from '@/api/drawing/drawing.api';
import { handleNetworkError } from '@/helpers/errors';
import { Prices } from '@/typings/enums/prices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import coinImg from '@/assets/coin.svg';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import successSound from '@/assets/sounds/success.wav';
import failSound from '@/assets/sounds/fail.wav';
import { QueryKeys } from '@/api/query-keys';
import { useSettingsStore } from '@/stores/settingsStore';
import type { DrawingMessagesResponse } from '@/api/drawing/drawing.api.interface';
import type { Game } from '@/api/game/game.api.interface';
import type { ProfileExtended } from '@/api/user/user.api.interface';
import { UserApi } from '@/api/user/user.api';

const props = defineProps<{
  guessedLetters: (string | null)[];
  drawingId: number;
  gameId: number;
  isDisabled: boolean;
}>();

const queryClient = useQueryClient();
const { playAudio } = useSettingsStore();

const { data: user } = useQuery({
  queryKey: [QueryKeys.Profile],
  queryFn: () => UserApi.profile(),
  enabled: false
});

const { mutate, isPending } = useMutation({
  mutationFn: (letterIndex: number) => DrawingApi.openDrawingLetter(props.drawingId, letterIndex),
  onSuccess: (openLetterResponse) => {
    if (openLetterResponse.isGuessed) {
      useAlertStore().showAlert('You guessed!', AlertTypes.Success);
    }
    playAudio(openLetterResponse.isGuessed ? successSound : failSound);
    queryClient.setQueryData([QueryKeys.Game, String(props.gameId)], (game: Game) => ({
      ...game,
      players: game.players.map((p) => {
        if (p.id === openLetterResponse.message.gamePlayerId) {
          return {
            ...p,
            points: openLetterResponse.updatedPoints
          };
        }
        return p;
      })
    }));
    queryClient.setQueryData(
      [QueryKeys.DrawingMessages],
      (drawingMessages: DrawingMessagesResponse) => ({
        isGuessed: openLetterResponse.isGuessed,
        guessedLetters: openLetterResponse.guessedLetters,
        messages: [...(drawingMessages.messages || []), openLetterResponse.message]
      })
    );
    queryClient.setQueryData([QueryKeys.Profile], (profile: ProfileExtended) => ({
      ...profile,
      money: openLetterResponse.updatedMoney
    }));
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const handleOpenLetter = async (index: number) => {
  if (isPending.value || props.guessedLetters[index] || props.isDisabled) {
    return;
  }
  mutate(index);
};
</script>

<template>
  <div class="flex gap-0.5 text-sm leading-4 justify-center flex-wrap">
    <div
      v-for="(letter, index) in guessedLetters"
      :key="index"
      class="bg-slate-100 border border-gray-main rounded-md h-5 w-5 text-blue-dark text-center relative *:hover:flex"
      :class="{ 'cursor-pointer': !letter && !isDisabled, 'opacity-70': isPending }"
      @click="handleOpenLetter(index)"
    >
      {{ letter }}
      <div
        v-if="!letter && !isDisabled && user && user.money >= Prices.OpenLetter"
        class="absolute -left-0.5 -translate-x-full border border-blue-dark rounded-md p-1 flex-col gap-1 bg-white hidden cursor-default transition-transform"
        @click.stop
      >
        <div class="text-nowrap text-sm">Open for</div>
        <div class="flex text-lg items-center justify-center gap-1">
          <span class="font-bold"> {{ Prices.OpenLetter }}</span>
          <img
            class="h-6 w-6"
            :src="coinImg"
            alt="coin"
          />
        </div>
      </div>
    </div>
  </div>
</template>
