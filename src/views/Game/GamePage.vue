<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';
import GameLobby from './components/GameLobby.vue';
import { watch } from 'vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { socket } from '@/helpers/socket';
import { UserApi } from '@/api/user/user.api';
import GamePlay from './components/GamePlay.vue';
import GameResults from './components/GameResults.vue';
import { QueryKeys } from '@/api/query-keys';
import { SocketEmitKeys } from '@/helpers/socket/emit-keys';

const route = useRoute();

const {
  isFetching: isFetchingProfile,
  isSuccess: isSuccessProfile,
  isError: isErrorProfile,
  data: user,
  error: errorProfile,
  refetch: refetchProfile
} = useQuery({
  queryKey: [QueryKeys.Profile],
  queryFn: UserApi.profile,
  enabled: false
});

watch(isFetchingProfile, () => {
  if (isErrorProfile.value) {
    useModalStore().showErrorModal(errorProfile.value);
  }
  if (data.value && user.value) {
    if (!data.value.isPrivate) {
      socket.emit(SocketEmitKeys.JoinGamePublic, { game: data.value });
    }
    socket.emit(SocketEmitKeys.JoinGame, {
      room: data.value.id,
      player: data.value.players.find((p) => p.user.id === user.value.id)
    });
  }
});

const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: [QueryKeys.Game, route.params.id],
  queryFn: () => GameApi.getGame(Number(route.params.id))
});

watch(isFetching, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
  if (isSuccess.value) {
    refetchProfile();
  }
});
</script>

<template>
  <SpinnerCenter v-if="isFetching || isFetchingProfile" />
  <template v-else-if="isSuccess && data && isSuccessProfile && user">
    <GameLobby
      v-if="!data.startDate"
      :game="data"
      :user="user"
    />
    <GamePlay
      v-else-if="!data.endDate"
      :game="data"
      :user="user"
    />
    <GameResults
      v-else
      :game="data"
      :user="user"
    />
  </template>
</template>
