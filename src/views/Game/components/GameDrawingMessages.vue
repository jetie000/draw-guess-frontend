<script setup lang="ts">
import InputMain from '@/components/Input/InputMain.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryReturnType
} from '@tanstack/vue-query';
import { DrawingApi } from '@/api/drawing/drawing.api';
import type { Drawing, DrawingMessagesResponse } from '@/api/drawing/drawing.api.interface';
import { ref, watch } from 'vue';
import { useModalStore } from '@/stores/modal/modalStore';
import Panel from '@/components/Panel/Panel.vue';
import { handleNetworkError } from '@/helpers/errors';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import type { Game } from '@/api/game/game.api.interface';
import { QueryKeys } from '@/api/query-keys';
import { useSettingsStore } from '@/stores/settingsStore';
import successSound from '@/assets/sounds/success.wav';
import failSound from '@/assets/sounds/fail.wav';

const props = defineProps<{
  queryData: UseQueryReturnType<Drawing | undefined, Error>;
  game: Game;
}>();

const { playAudio } = useSettingsStore();
const queryClient = useQueryClient();
const message = ref('');

const { data, isLoading, isError, refetch, error } = useQuery({
  queryKey: [QueryKeys.DrawingMessages],
  queryFn: () => DrawingApi.getDrawingMessages(props.queryData.data.value?.id || 0),
  enabled: false
});

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    DrawingApi.addDrawingMessage(props.queryData.data.value?.id || 0, message.value),
  onError: (error) => {
    handleNetworkError(error);
  },
  onSuccess: (wordResponse) => {
    if (wordResponse.isGuessed) {
      useAlertStore().showAlert('You guessed!', AlertTypes.Success);
    }
    playAudio(wordResponse.isGuessed ? successSound : failSound);
    queryClient.setQueryData([QueryKeys.Game, String(props.game.id)], {
      ...props.game,
      players: props.game.players.map((p) => {
        if (p.id === wordResponse.message.gamePlayerId) {
          return {
            ...p,
            points: wordResponse.updatedPoints
          };
        }
        return p;
      })
    });
    queryClient.setQueryData([QueryKeys.DrawingMessages], {
      isGuessed: wordResponse.isGuessed,
      guessedLetters: wordResponse.guessedLetters,
      messages: [...(data.value?.messages || []), wordResponse.message]
    } as DrawingMessagesResponse);
    message.value = '';
  }
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

watch(props.queryData.isFetching, () => {
  if (props.queryData.isSuccess.value) {
    refetch();
  }
});
</script>

<template>
  <Panel
    class="flex flex-col gap-1 max-xsm:w-full h-52"
    no-padding
  >
    <p class="m-1.5 mb-1 text-center">
      {{ data && data.isGuessed ? 'You guessed!' : 'Guess the word' }}
    </p>
    <div
      class="flex gap-0.5 text-sm leading-4 justify-center flex-wrap"
      v-if="data?.guessedLetters"
    >
      <div
        class="bg-slate-100 border border-gray-main rounded-md h-5 w-5 text-blue-dark text-center"
        v-for="(letter, index) in data.guessedLetters"
        :key="index"
      >
        {{ letter }}
      </div>
    </div>
    <div
      v-if="data"
      class="flex flex-col overflow-y-auto gap-1"
    >
      <div
        class="p-0.5 px-2 mx-1 bg-slate-100 border border-gray-main rounded-md text-blue-dark"
        v-for="message in data.messages"
        :key="message.id"
      >
        {{ message.message }}
      </div>
    </div>
    <div class="flex mt-auto w-full">
      <InputMain
        v-model.trim="message"
        not-full-width
        class="rounded-bl-md rounded-none m-1 border-blue-dark grow"
        :disabled="data?.isGuessed"
        @keydown.enter="mutate"
      />
      <ButtonMain
        class="m-1 ms-0 rounded-none rounded-br-md"
        :disabled="data?.isGuessed || isPending || !message || isLoading"
        @click="mutate"
      >
        <Spinner
          v-if="isPending"
          class="w-5 h-5 -m-1"
        />
        <ArrowRightIcon
          v-else
          class="w-5 h-5 -m-1"
        />
      </ButtonMain>
    </div>
  </Panel>
</template>
