<script setup lang="ts">
import type { Drawing, Word } from '@/api/drawing/drawing.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Panel from '@/components/Panel/Panel.vue';
import coinImg from '@/assets/coin.svg';
import { DrawingApi } from '@/api/drawing/drawing.api';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { QueryKeys } from '@/api/query-keys';
import { handleNetworkError } from '@/helpers/errors';
import type { ProfileExtended } from '@/api/user/user.api.interface';
import { ref } from 'vue';
import { socket } from '@/helpers/socket';
import { SocketEmitKeys } from '@/helpers/socket/emit-keys';

const props = defineProps<{
  gameId: number;
  word: Word | undefined;
  isCanChange: boolean;
  secondsRemainingToChange: number;
}>();

const queryClient = useQueryClient();
const isChanged = ref(false);

const { mutate, isPending } = useMutation({
  mutationFn: () => DrawingApi.changeDrawingWord(props.gameId),
  onSuccess: ({ updatedMoney, word }) => {
    isChanged.value = true;
    queryClient.setQueryData([QueryKeys.Drawing, props.gameId], (drawing: Drawing) => ({
      ...drawing,
      word
    }));
    queryClient.setQueryData([QueryKeys.Profile], (profile: ProfileExtended) => ({
      ...profile,
      money: updatedMoney
    }));
    socket.emit(SocketEmitKeys.ChangeDrawingWord, {
      room: props.gameId
    });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});
</script>

<template>
  <Panel class="flex flex-col gap-3 max-xsm:w-full text-center">
    <span class="text-gray-secondary">Your word</span>
    <span class="font-bold text-xl">{{ word?.word || '-' }}</span>
    <ButtonMain
      class="gap-2 flex-wrap"
      v-if="isCanChange && !isChanged && word"
      :disabled="isPending"
      @click="mutate"
    >
      <div class="flex items-center gap-1 justify-center w-full">
        Change word for 50
        <img
          class="h-6 w-6"
          :src="coinImg"
          alt="coin"
        />
      </div>
      <div class="w-full">{{ secondsRemainingToChange }} seconds...</div>
    </ButtonMain>
  </Panel>
</template>
