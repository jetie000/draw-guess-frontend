<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import GameCanvas from './GameCanvas.vue';
import { ref } from 'vue';
import paper from 'paper';
import GamePlayInfo from './GamePlayInfo.vue';
import GameDrawingOptions from './GameDrawingOptions.vue';

defineProps<{ game: Game; user: Profile }>();

const path = ref<paper.Path>();
</script>

<template>
  <div class="flex justify-center gap-3 p-5 max-lg:flex-col max-md:p-3 max-sm:p-1 max-sm:gap-1">
    <GameCanvas
      :path="path"
      :game="game"
      :user="user"
    />
    <div
      class="flex gap-3 flex-col max-lg:justify-between max-lg:grid max-lg:grid-cols-2 max-sm:flex max-sm:flex-col max-sm:gap-1"
    >
      <GamePlayInfo :game="game" />
      <Panel class="flex flex-col gap-3 max-xsm:w-full text-center">
        <span class="text-gray-secondary">Your word</span>
        <span class="font-bold text-xl">Example</span>
      </Panel>
      <GameDrawingOptions :path="path" />
    </div>
  </div>
</template>
