<script setup lang="ts">
import PlayerLobby from './PlayerLobby.vue';
import Panel from '@/components/Panel/Panel.vue';
import type { Game } from '@/api/game/game.api.interface';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import { computed, ref } from 'vue';

const props = defineProps<{ game: Game }>();

const playersPage = ref(1);

const PlayersPerPage = 3;

const displayedPlayers = computed(() =>
  Array.from(
    props.game.players
      .slice()
      .sort((a, b) => b.points - a.points)
      .slice((playersPage.value - 1) * PlayersPerPage, playersPage.value * PlayersPerPage)
  )
);

const handleDecreasePage = () => {
  if (playersPage.value === 1) {
    return;
  }
  playersPage.value--;
};

const handleIncreasePage = () => {
  if (playersPage.value === Math.ceil(props.game.players.length / PlayersPerPage)) {
    return;
  }
  playersPage.value++;
};
</script>

<template>
  <Panel class="flex flex-col gap-3 max-xsm:w-full">
    <span class="text-xl">
      Game <b>#{{ game.id }}</b>
    </span>
    <div class="flex justify-between gap-4 text-sm text-gray-secondary">
      <div class="flex flex-col gap-2">
        <span>Access</span>
        <span>Round duration</span>
        <span>Players</span>
        <span>Drawings per player</span>
      </div>
      <div class="flex flex-col gap-2 font-bold text-blue-dark items-center">
        <span>{{ game.isPrivate ? 'Private' : 'Public' }}</span>
        <span>{{ game.roundDuration }}s</span>
        <span>{{ game.players.length }}</span>
        <span>{{ game.drawingsPerPlayer }}</span>
      </div>
    </div>
  </Panel>
  <Panel
    class="flex flex-col gap-3 max-xsm:w-full"
    :style="{ height: game.players.length > PlayersPerPage ? '170px' : 'auto' }"
  >
    <div class="flex justify-between">
      <span class="text-xl">Players</span>
      <ChevronLeftIcon
        v-if="game.players.length > PlayersPerPage"
        class="w-6 h-6 ml-auto cursor-pointer"
        :class="{ 'text-gray-secondary': playersPage === 1 }"
        @click="handleDecreasePage"
      />
      <ChevronRightIcon
        v-if="game.players.length > PlayersPerPage"
        class="w-6 h-6 cursor-pointer"
        :class="{
          'text-gray-secondary': playersPage === Math.ceil(game.players.length / PlayersPerPage)
        }"
        @click="handleIncreasePage"
      />
    </div>
    <div class="flex flex-col gap-3">
      <PlayerLobby
        v-for="player in displayedPlayers"
        :player="player"
        display-points
        :key="player.id"
      />
    </div>
  </Panel>
</template>
