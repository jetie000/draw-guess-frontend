<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import PlayerLobby from './PlayerLobby.vue';
import GameDrawingCard from './GameDrawingCard.vue';
import { format } from 'date-fns';

const props = defineProps<{ game: Game; user: Profile }>();

const gameInfo = [
  {
    name: 'Access',
    value: props.game.isPrivate ? 'Private' : 'Public'
  },
  {
    name: 'Round duration',
    value: `${props.game.roundDuration}s`
  },
  {
    name: 'Players',
    value: `${props.game.players.length}/${props.game.maxPlayers}`
  },
  {
    name: 'Drawings per player',
    value: props.game.drawingsPerPlayer
  },
  {
    name: 'End date',
    value: props.game.endDate
      ? format(
          props.game.endDate,
          `H:m, dd.LL${new Date().getFullYear() === new Date(props.game.endDate).getFullYear() ? '' : '.Y'}`
        )
      : '-'
  }
];
</script>

<template>
  <div class="flex gap-3 p-3 place-self-center w-full">
    <div class="flex flex-col gap-3 grow">
      <div class="text-xl font-bold my-1.5 text-center">Drawings</div>
      <div class="grid cols grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        <GameDrawingCard
          v-for="drawing in game.drawings"
          :key="drawing.id"
          :drawing="drawing"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <div class="text-2xl font-bold my-1 text-center">Game #{{ game.id }}</div>
      <Panel class="flex flex-col justify-between gap-2 text-sm text-gray-secondary max-xsm:w-full">
        <div
          v-for="infoItem in gameInfo"
          :key="infoItem.name"
        >
          <div class="flex gap-3 justify-between shrink-0 whitespace-nowrap">
            <span>{{ infoItem.name }}</span>
            <span class="font-bold text-blue-dark whitespace-nowrap">
              {{ infoItem.value }}
            </span>
          </div>
        </div>
      </Panel>
      <Panel class="max-xsm:w-full">
        <div class="font-bold mb-2 text-center">Creator</div>
        <PlayerLobby
          :player="game.players.find((p) => p.user.id === game.creatorId)!"
          display-points
        />
        <template v-if="game.players.length > 1">
          <hr class="my-4 -mx-4" />
          <PlayerLobby
            v-for="player in game.players
              .filter((p) => p.user.id !== game.creatorId)
              .slice()
              .sort((a, b) => b.points - a.points)"
            :player="player"
            :key="player.user.id"
            display-points
          />
        </template>
      </Panel>
    </div>
  </div>
</template>
