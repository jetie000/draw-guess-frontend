<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { formatDate } from '@/helpers/datetime';
import { ClockIcon, PencilSquareIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const props = defineProps<{ game: Game; userId: number }>();

const router = useRouter();

const handleClick = () => {
  router.push({ name: 'Game', params: { id: props.game.id } });
};
</script>

<template>
  <ButtonMain
    theme="secondary"
    class="flex flex-col gap-3 ps-2.5 font-normal items-stretch"
    @click="handleClick"
  >
    <div class="flex gap-3 max-sm:flex-col">
      <div class="flex gap-3 justify-between items-center max-sm:flex-wrap max-sm:w-full">
        <span class="text-xl">#{{ game.id }}</span>
        <div
          v-if="!game.endDate"
          :class="`font-bold p-2 rounded-md ${game.startDate ? 'bg-green-500' : 'bg-yellow-400'} max-sm:w-full`"
        >
          {{ game.startDate ? 'In process' : 'Waiting for start' }}
        </div>
        <UserCircleIcon class="w-6 h-6 -mr-2 ml-auto" />
        <span>{{ game.players.length }}/{{ game.maxPlayers }}</span>
        <ClockIcon class="w-6 h-6 -mr-2" />
        <span> {{ game.roundDuration }}s </span>
        <PencilSquareIcon class="w-6 h-6 -mr-2" />
        <span>{{ game.drawingsPerPlayer }}</span>
      </div>
      <div
        v-if="game.endDate"
        class="flex items-center w-full gap-3 justify-end"
      >
        {{ formatDate(game.endDate) }}
        <span class="text-green-500 text-lg">
          + {{ game.players.find((player) => player.user.id === userId)?.points ?? 0 }}
        </span>
      </div>
    </div>
    <div class="flex w-full justify-between items-center gap-2">
      <div
        :class="`font-bold p-2 rounded-md ${game.isSimplified ? 'bg-lime-400' : 'bg-zinc-400'} max-sm:w-full`"
      >
        {{ game.isSimplified ? 'Simple' : 'Standard' }}
      </div>
      <span>{{ game.wordTypes.map((t) => t.type).join(', ') }}</span>
    </div>
  </ButtonMain>
</template>
