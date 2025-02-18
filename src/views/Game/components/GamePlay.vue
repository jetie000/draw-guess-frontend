<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import PlayerLobby from './PlayerLobby.vue';
import GameCanvas from './GameCanvas.vue';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDrawingStore } from '../stores/drawingStore';
import paper from 'paper';

defineProps<{ game: Game; user: Profile }>();

const path = ref<paper.Path>();

const { color, strokeWidth } = storeToRefs(useDrawingStore());

const handleChangeColor = (event: Event) => {
  color.value = (event.target as HTMLInputElement).value;
  if (!path.value) {
    return;
  }
  path.value.strokeColor = new paper.Color(color.value);
};
</script>

<template>
  <div class="h-full flex justify-center gap-3">
    <Panel
      class="flex grow relative aspect-square max-w-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)]"
    >
      <GameCanvas v-model:path="path" />
    </Panel>
    <div class="flex flex-col gap-3">
      <Panel class="flex flex-col gap-3 max-xsm:w-full">
        <span class="text-xl">
          Game <b>#{{ game.id }}</b>
        </span>
        <div class="flex justify-between gap-4 text-sm text-gray-secondary">
          <div class="flex flex-col gap-2">
            <span>Access</span>
            <span>Round Duration</span>
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
      <Panel class="flex flex-col gap-3 max-xsm:w-full">
        <span class="text-xl">Players</span>
        <div class="flex flex-col gap-3">
          <PlayerLobby
            v-for="player in game.players"
            :player="player"
            display-points
            :key="player.user.id"
          />
        </div>
      </Panel>
      <Panel class="flex flex-col gap-3 max-xsm:w-full text-center">
        <span class="text-gray-secondary">Your word</span>
        <span class="font-bold text-xl">Example</span>
      </Panel>
      <Panel class="flex flex-col gap-3 max-xsm:w-full">
        <input
          type="color"
          @change="handleChangeColor"
        />
      </Panel>
    </div>
  </div>
</template>
