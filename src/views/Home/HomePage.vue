<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import GameButtons from './components/GameButtons.vue';
import ParticipatingGames from './components/ParticipatingGame.vue';
import { GameApi } from '@/api/game/game.api';
import PublicGames from './components/PublicGames.vue';
import { onMounted, onUnmounted, watch } from 'vue';
import { socket } from '@/helpers/socket';
import { UserApi } from '@/api/user/user.api';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import type { Player } from '@/typings/interfaces/player.interface';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';

const queryClient = useQueryClient();

const { isFetching, data, isError, error, isSuccess } = useQuery({
  queryKey: ['participating-games'],
  queryFn: () => GameApi.getParticipatingGames()
});

const {
  isFetching: isFetchingProfile,
  isError: isErrorProfile,
  data: user,
  error: errorProfile,
  refetch: refetchProfile
} = useQuery({
  queryKey: ['profile'],
  queryFn: UserApi.profile,
  enabled: false
});

onMounted(() => {
  socket.on('joinedGame', (player: Player) => {
    if (data.value?.length && !data.value[0].players.find((p) => p.user.id === player.user.id)) {
      queryClient.setQueryData(
        ['participating-games'],
        [
          {
            ...data.value[0],
            players: [...data.value[0].players, player]
          }
        ]
      );
    }
  });

  socket.on('leftGame', (userId) => {
    if (data.value?.length) {
      queryClient.setQueryData(
        ['participating-games'],
        [
          {
            ...data.value[0],
            players: data.value[0].players.filter((p) => p.user.id !== userId)
          }
        ]
      );
    }
  });

  socket.on('deletedGame', () => {
    queryClient.setQueryData(['participating-games'], []);
    useAlertStore().showAlert('Game has been deleted', AlertTypes.Warning);
  });

  socket.emit('joinPublic');
});

onUnmounted(() => {
  socket.emit('leavePublic');
  socket.off('joinedGame');
  socket.off('leftGame');
  socket.off('deletedGame');
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
  if (isSuccess.value && !user.value) {
    refetchProfile();
  }
});

watch(isFetchingProfile, () => {
  if (isErrorProfile.value) {
    useErrorModalStore().showModal(errorProfile.value);
  }
  if (data.value && data.value[0] && user.value) {
    socket.emit('joinGame', {
      room: data.value[0].id,
      player: data.value[0].players.find((p) => p.user.id === user.value.id)
    });
  }
});
</script>

<template>
  <main class="bg-yellow-secondary flex flex-col items-center">
    <div class="flex flex-col items-center">
      <GameButtons
        class="mt-12 mb-6"
        :is-participating="(data && data?.length > 0) || isFetching"
      />
      <ParticipatingGames />
      <PublicGames />
    </div>
  </main>
</template>
