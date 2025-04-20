<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import PlayerLobby from './PlayerLobby.vue';
import GameDrawingCard from './GameDrawingCard.vue';

defineProps<{ game: Game; user: Profile }>();
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
      <Panel class="flex justify-between gap-4 text-sm text-gray-secondary max-xsm:w-full">
        <div class="flex flex-col gap-2">
          <span>Access</span>
          <span>Round Duration</span>
          <span>Players</span>
          <span>Drawings per player</span>
        </div>
        <div class="flex flex-col gap-2 font-bold text-blue-dark items-center">
          <span>{{ game.isPrivate ? 'Private' : 'Public' }}</span>
          <span>{{ game.roundDuration }}s</span>
          <span>{{ game.players.length }}/{{ game.maxPlayers }}</span>
          <span>{{ game.drawingsPerPlayer }}</span>
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
