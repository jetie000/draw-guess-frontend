<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import GameButtons from './components/GameButtons.vue';
import ParticipatingGames from './components/ParticipatingGame.vue';
import { GameApi } from '@/api/game/game.api';
import PublicGames from './components/PublicGames.vue';
import { onMounted, watch } from 'vue';
import { socket } from '@/helpers/socket';
import { UserApi } from '@/api/user/user.api';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';

const { isFetching, data, refetch, isError, error, isSuccess } = useQuery({
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
  ['joinedGame', 'leftGame', 'deletedGame'].forEach((event) => {
    socket.on(event, refetch);
  });
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
