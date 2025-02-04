<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { ClockIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { format } from 'date-fns';

defineProps<{ game: Game; isCreator: boolean }>();
</script>

<template>
  <ButtonMain
    theme="secondary"
    class="flex gap-3 justify-between items-center ps-2.5 font-normal"
    @click="$router.push({ name: 'Game', params: { id: game.id } })"
  >
    <div :class="`font-bold p-2 rounded-md ${game.startDate ? 'bg-green-500' : 'bg-yellow-400'}`">
      {{ game.startDate ? 'In process' : 'Waiting for start' }}
    </div>
    <UserCircleIcon class="w-6 h-6 -mr-1 ml-auto" />
    <span>{{ game.players.length }}/{{ game.maxPlayers }}</span>
    <template v-if="game.startDate">
      <ClockIcon class="w-6 h-6 -mr-1" />
      <span>
        {{ format(game.startDate, 'HH:mm dd.MM') }}
      </span>
    </template>
  </ButtonMain>
</template>
