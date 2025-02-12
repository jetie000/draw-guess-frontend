<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';
import GameLobby from './components/GameLobby.vue';
import { watch } from 'vue';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { socket } from '@/helpers/socket';
import { UserApi } from '@/api/user/user.api';

const route = useRoute();

const {
  isFetching: isFetchingProfile,
  isSuccess: isSuccessProfile,
  isError: isErrorProfile,
  data: user,
  error: errorProfile,
  refetch: refetchProfile
} = useQuery({
  queryKey: ['profile'],
  queryFn: UserApi.profile,
  enabled: false
});

watch(isFetchingProfile, () => {
  if (isErrorProfile.value) {
    useErrorModalStore().showModal(errorProfile.value);
  }
  if (data.value && user.value) {
    if (!data.value.isPrivate) {
      socket.emit('joinGamePublic', { game: data.value });
    }
    socket.emit('joinGame', {
      room: data.value.id,
      player: data.value.players.find((p) => p.user.id === user.value.id)
    });
  }
});

const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: ['game', route.params.id],
  queryFn: () => GameApi.getGame(Number(route.params.id))
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
  if (isSuccess.value) {
    refetchProfile();
  }
});
</script>

<template>
  <div class="p-5">
    <SpinnerCenter v-if="isFetching || isFetchingProfile" />
    <div v-else-if="isSuccess && data && isSuccessProfile && user">
      <GameLobby
        v-if="!data?.startDate"
        :game="data"
        :user="user"
      />
    </div>
  </div>
</template>
