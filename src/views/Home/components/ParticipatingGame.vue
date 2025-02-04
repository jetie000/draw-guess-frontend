<script setup lang="ts">
import { GameApi } from '@/api/game/game.api';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import GameCard from './GameCard.vue';
import { UserApi } from '@/api/user/user.api';

const { isFetching, isSuccess, isError, data, error } = useQuery({
  queryKey: ['participating-games'],
  queryFn: () => GameApi.getParticipatingGames()
});

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
  <div class="flex w-full">
    <Spinner
      class="mx-auto"
      :size="8"
      color="blue-dark"
      v-if="isFetching"
    />
    <div
      v-else-if="isSuccess && isSuccessProfile && data?.length && user"
      class="flex flex-col w-full gap-3"
    >
      <hr class="my-3" />
      <h2 class="text-2xl font-bold text-center">Participating</h2>
      <GameCard
        :game="data[0]"
        :is-creator="data[0].creatorId === user.id"
      />
      <hr class="my-3" />
    </div>
  </div>
</template>
