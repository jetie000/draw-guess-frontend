<script setup lang="ts">
import { GameApi } from '@/api/game/game.api';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { onMounted, onUnmounted, watch } from 'vue';
import GameJoinCard from './GameJoinCard.vue';
import { socket } from '@/helpers/socket';
import type { Game } from '@/api/game/game.api.interface';
import { QueryKeys } from '@/api/query-keys';
import { SocketEventKeys } from '@/helpers/socket/event-keys';

defineProps<{ participatingGames: Game[] | undefined }>();

const queryClient = useQueryClient();

const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: [QueryKeys.PublicGames],
  queryFn: () => GameApi.getPublicGames()
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
});

onMounted(() => {
  socket.on(SocketEventKeys.JoinedGamePublic, (game: Game) => {
    if (!data.value) {
      return;
    }
    const index = data.value.findIndex((pGame) => pGame.id === game.id);
    if (index === -1) {
      queryClient.setQueryData([QueryKeys.PublicGames], [game, ...data.value]);
      return;
    }
    queryClient.setQueryData(
      [QueryKeys.PublicGames],
      [...data.value.slice(0, index), game, ...data.value.slice(index + 1)]
    );
  });

  socket.on(SocketEventKeys.LeftGamePublic, ({ room, userId }) => {
    if (!data.value) {
      return;
    }
    const index = data.value.findIndex((pGame) => pGame.id === room);
    if (index === -1) {
      queryClient.setQueryData(
        [QueryKeys.PublicGames],
        [
          ...data.value.slice(0, index),
          {
            ...data.value[index],
            players: data.value[index].players.filter((p) => p.user.id !== userId)
          },
          ...data.value.slice(index + 1)
        ]
      );
    }
  });

  socket.on(SocketEventKeys.DeletedGamePublic, (room) => {
    if (!data.value) {
      return;
    }
    queryClient.setQueryData(
      [QueryKeys.PublicGames],
      data.value.filter((pGame) => pGame.id !== room)
    );
  });
});

onUnmounted(() => {
  socket.off(SocketEventKeys.JoinedGamePublic);
  socket.off(SocketEventKeys.LeftGamePublic);
  socket.off(SocketEventKeys.DeletedGamePublic);
});
</script>

<template>
  <div
    v-if="isSuccess && data?.length"
    class="flex flex-col w-full gap-3"
  >
    <h2 class="text-2xl font-bold text-center mt-3">Public</h2>
    <GameJoinCard
      v-for="game in data"
      :key="game.id"
      :game="game"
      :is-joined-this="false"
      :is-joined="!!participatingGames && participatingGames?.length > 0"
    />
  </div>
</template>
