<script setup lang="ts">
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import InputRadioButtons from '@/components/Input/InputRadioButtons.vue';
import Panel from '@/components/Panel/Panel.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import PlayerWithPoints from '@/components/User/PlayerWithPoints.vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { LeaderboardTypes } from '@/typings/enums/user';
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';

const leaderboardType = ref<LeaderboardTypes>(LeaderboardTypes.Wins);
const leaderboardPeriod = ref<number>(7);

const { data, isError, isLoading, error, refetch } = useQuery({
  queryKey: [QueryKeys.Leaderboard, leaderboardType, leaderboardPeriod],
  queryFn: () => UserApi.getLeaderboard(leaderboardType.value, leaderboardPeriod.value)
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

watch([leaderboardType, leaderboardPeriod], () => {
  refetch();
});

const descriptionByType = {
  [LeaderboardTypes.Points]: 'Total earned points',
  [LeaderboardTypes.Wins]: 'Total mathes won',
  [LeaderboardTypes.WordsGuessed]: 'Total words guessed'
};

const innerWidth = window.innerWidth;
</script>

<template>
  <Panel class="flex flex-col gap-2">
    <h2 class="text-2xl font-bold text-center mb-2">Leaderboard</h2>
    <InputRadioButtons
      v-model="leaderboardType"
      name="leaderboard-type"
      class="border border-blue-dark"
      :is-vertical="innerWidth < 480"
      :radio-values="[
        { id: 'points', label: 'Points', value: LeaderboardTypes.Points },
        { id: 'wins', label: 'Wins', value: LeaderboardTypes.Wins },
        { id: 'words-guessed', label: 'Guessed', value: LeaderboardTypes.WordsGuessed }
      ]"
    />
    <InputRadioButtons
      v-model="leaderboardPeriod"
      name="leaderboard-period"
      class="border border-blue-dark"
      :is-vertical="innerWidth < 480"
      :radio-values="[
        { id: '1', label: '1 day', value: 1 },
        { id: '7', label: '7 days', value: 7 },
        { id: '30', label: '30 days', value: 30 }
      ]"
    />
    <h4 class="text-center font-semibold">{{ descriptionByType[leaderboardType] }}</h4>
    <Spinner
      v-if="isLoading"
      class="self-center mt-2"
      color="blue-dark"
    />
    <template v-else-if="data?.length">
      <PlayerWithPoints
        v-for="player in data"
        :key="player.id"
        :player="{
          id: player.id,
          points: player.wins ?? player.wordsGuessed ?? player.points ?? 0,
          user: player
        }"
        display-points
        class="mt-1.5"
      />
    </template>
    <div
      v-else
      class="mt-2 text-center"
    >
      There are no players at current period
    </div>
  </Panel>
</template>
