<script setup lang="ts">
import { GameApi } from '@/api/game/game.api';
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import Spinner from '@/components/Spinner/Spinner.vue';
import { getErrorMessage } from '@/helpers/errors';
import { getLevelAndProgressByExp } from '@/helpers/game';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useQuery } from '@tanstack/vue-query';
import { computed, watch } from 'vue';
import userIcon from '@/assets/user.svg';
import GameInfoCard from './GameInfoCard.vue';

const { isFetching, data, isError, error, isSuccess } = useQuery({
  queryKey: [QueryKeys.ParticipatingGames],
  queryFn: () => GameApi.getParticipatingGames(true)
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
});

const replaceAvatarByDefault = (event: Event) => {
  (event.target as HTMLImageElement).src = userIcon;
};

const levelAndProgress = computed(
  () => user.value && getLevelAndProgressByExp(user.value.experience)
);

const gamesWon = computed(() =>
  data.value?.length && user.value
    ? data.value.reduce((acc, game) => {
        const wonPlayer = game.players.slice().sort((a, b) => b.points - a.points)[0];
        const myPlayer = game.players.find((player) => player.user.id === user.value.id);
        if (myPlayer?.points === wonPlayer.points) {
          return acc + 1;
        }
        return acc;
      }, 0)
    : 0
);
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <h3 class="font-bold text-lg">My Level</h3>
    <div class="flex relative items-center gap-6 mt-3 max-sm:flex-col">
      <img
        class="w-36 h-36 rounded-full"
        :src="user?.avatarUrl || userIcon"
        alt="Avatar"
        @error="replaceAvatarByDefault"
      />
      <template v-if="levelAndProgress">
        <div
          class="absolute h-10 min-w-10 -top-2 left-28 text-3xl text-center align-middle px-3 rounded-full border border-blue-dark"
          :style="{
            background: levelAndProgress.background,
            color: levelAndProgress.color
          }"
        >
          {{ levelAndProgress.level }}
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-end text-xs font-bold">
            {{ levelAndProgress.pointsForNextLevel - levelAndProgress.pointsEarnedAtLevel }}
            points remaining
          </span>
          <div
            class="w-48 h-5 border border-blue-dark rounded-full"
            :style="{
              background: levelAndProgress.background
            }"
          >
            <div
              :style="{
                background: levelAndProgress.color,
                width: `${levelAndProgress.progress}%`,
                height: '100%',
                borderTopLeftRadius: '0.625rem',
                borderBottomLeftRadius: '0.625rem'
              }"
            />
          </div>
          <span class="text-xs font-bold">
            {{ levelAndProgress.pointsEarnedAtLevel }}/{{ levelAndProgress.pointsForNextLevel }}
          </span>
        </div>
      </template>
      <div class="text-lg flex flex-col gap-2">
        <div class="flex justify-between gap-2">
          Played games: <span class="font-bold">{{ data?.length ?? 0 }}</span>
        </div>
        <div class="flex justify-between gap-2">
          Won games:
          <span class="font-bold">{{ gamesWon }}</span>
        </div>
      </div>
    </div>
    <h3 class="font-bold text-lg mt-3">Recent Games</h3>
    <Spinner
      v-if="isFetching || isFetchingProfile"
      class="mx-auto"
    />
    <p
      class="m-auto text-lg"
      v-else-if="isError"
    >
      {{ getErrorMessage(error) }}
    </p>
    <div
      class="flex flex-col gap-2"
      v-else-if="data && data.length && user"
    >
      <GameInfoCard
        v-for="game in data"
        :key="game.id"
        :game="game"
        :user-id="user.id"
      />
    </div>
    <template v-else> No recent games yet </template>
  </div>
</template>
