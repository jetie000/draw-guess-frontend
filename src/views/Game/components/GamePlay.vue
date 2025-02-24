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
  <div class="h-full flex justify-center gap-3">
    <Panel
      class="flex aspect-square max-w-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] width-full height-full max-xsm:w-full"
    >
      <GameCanvas
        :path="path"
        :game="game"
        :user="user"
      />
    </Panel>
    <div class="flex flex-col gap-3">
      <GamePlayInfo :game="game" />
      <Panel class="flex flex-col gap-3 max-xsm:w-full text-center">
        <span class="text-gray-secondary">Your word</span>
        <span class="font-bold text-xl">Example</span>
      </Panel>
      <GameDrawingOptions :path="path" />
    </div>
  </div>
</template>
