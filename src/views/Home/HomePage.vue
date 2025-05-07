<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import GameButtons from './components/GameButtons.vue';
import ParticipatingGames from './components/ParticipatingGame.vue';
import { GameApi } from '@/api/game/game.api';
import PublicGames from './components/PublicGames.vue';
import { onMounted, onUnmounted, watch } from 'vue';
import { socket } from '@/helpers/socket';
import { UserApi } from '@/api/user/user.api';
import { useModalStore } from '@/stores/modal/modalStore';
import type { Player } from '@/typings/interfaces/player.interface';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import { QueryKeys } from '@/api/query-keys';
import { SocketEventKeys } from '@/helpers/socket/event-keys';
import { SocketEmitKeys } from '@/helpers/socket/emit-keys';

const queryClient = useQueryClient();

const { isFetching, data, isError, error, isSuccess } = useQuery({
  queryKey: [QueryKeys.ParticipatingGames],
  queryFn: () => GameApi.getParticipatingGames()
});

const {
  isFetching: isFetchingProfile,
  isError: isErrorProfile,
  data: user,
  error: errorProfile,
  refetch: refetchProfile
} = useQuery({
  queryKey: [QueryKeys.Profile],
  queryFn: UserApi.profile,
  enabled: false
});

onMounted(() => {
  socket.on(SocketEventKeys.JoinedGame, (player: Player) => {
    if (data.value?.length && !data.value[0].players.find((p) => p.user.id === player.user.id)) {
      queryClient.setQueryData(
        [QueryKeys.ParticipatingGames],
        [
          {
            ...data.value[0],
            players: [...data.value[0].players, player]
          }
        ]
      );
    }
  });

  socket.on(SocketEventKeys.LeftGame, (userId) => {
    if (data.value?.length) {
      queryClient.setQueryData(
        [QueryKeys.ParticipatingGames],
        [
          {
            ...data.value[0],
            players: data.value[0].players.filter((p) => p.user.id !== userId)
          }
        ]
      );
    }
  });

  socket.on(SocketEventKeys.DeletedGame, () => {
    queryClient.setQueryData([QueryKeys.ParticipatingGames], []);
    useAlertStore().showAlert('Game has been deleted', AlertTypes.Warning);
  });

  socket.emit(SocketEmitKeys.JoinPublic);
});

onUnmounted(() => {
  socket.emit(SocketEmitKeys.LeavePublic);
  socket.off(SocketEventKeys.JoinedGame);
  socket.off(SocketEventKeys.LeftGame);
  socket.off(SocketEventKeys.DeletedGame);
});

watch(isFetching, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
  if (isSuccess.value && !user.value) {
    refetchProfile();
  }
});

watch(isFetchingProfile, () => {
  if (isErrorProfile.value) {
    useModalStore().showErrorModal(errorProfile.value);
  }
  if (data.value && data.value[0] && user.value) {
    socket.emit(SocketEmitKeys.JoinGame, {
      room: data.value[0].id,
      player: data.value[0].players.find((p) => p.user.id === user.value.id)
    });
  }
});
</script>

<template>
  <div class="flex flex-col items-center px-3">
    <div class="flex flex-col items-center">
      <GameButtons
        class="mt-12 mb-6"
        :is-participating="(data && data?.length > 0) || isFetching"
      />
      <ParticipatingGames
        :participating-games="data"
        :is-fetching="isFetching"
      />
      <PublicGames :participating-games="data" />
    </div>
  </div>
</template>
