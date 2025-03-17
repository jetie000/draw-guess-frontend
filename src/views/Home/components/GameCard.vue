<script setup lang="ts">
import { GameApi } from '@/api/game/game.api';
import type { Game } from '@/api/game/game.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { handleNetworkError } from '@/helpers/errors';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import { ClockIcon, PencilSquareIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

const props = defineProps<{ game: Game; isJoinedThis: boolean; isJoined: boolean }>();

const router = useRouter();

const { isPending, mutate } = useMutation({
  mutationFn: () => GameApi.joinGame(props.game.code),
  onSuccess: (data) => {
    router.push({ name: 'Game', params: { id: data } });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const handleClick = () => {
  if (props.isJoinedThis) {
    router.push({ name: 'Game', params: { id: props.game.id } });
    return;
  } else if (props.isJoined) {
    useAlertStore().showAlert('You are already in another game', AlertTypes.Warning);
    return;
  }
  mutate();
};
</script>

<template>
  <ButtonMain
    theme="secondary"
    class="flex flex-col gap-3 ps-2.5 font-normal"
    @click="handleClick"
    :disabled="isPending"
  >
    <div class="flex gap-3 justify-between items-center flex-wrap w-full">
      <div
        :class="`font-bold p-2 rounded-md ${game.startDate ? 'bg-green-500' : 'bg-yellow-400'} max-sm:w-full`"
      >
        {{ game.startDate ? 'In process' : 'Waiting for start' }}
      </div>
      <span class="text-xl">#{{ game.id }}</span>
      <UserCircleIcon class="w-6 h-6 -mr-2 ml-auto" />
      <span>{{ game.players.length }}/{{ game.maxPlayers }}</span>
      <ClockIcon class="w-6 h-6 -mr-2" />
      <span> {{ game.roundDuration }}s </span>
      <PencilSquareIcon class="w-6 h-6 -mr-2" />
      <span>{{ game.drawingsPerPlayer }}</span>
    </div>
    <div class="flex w-full justify-end">
      {{ game.wordTypes.map((t) => t.type).join(', ') }}
    </div>
  </ButtonMain>
</template>
