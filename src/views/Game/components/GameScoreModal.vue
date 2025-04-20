<script setup lang="ts">
import type { Player } from '@/typings/interfaces/player.interface';
import Modal from '@/components/Modal/Modal.vue';
import PlayerLobby from './PlayerLobby.vue';

defineProps<{
  players: Player[];
  isOpen: boolean;
  round: number;
}>();
</script>

<template>
  <Modal
    :is-open="isOpen"
    :backdrop-dismiss="false"
    size="sm"
    no-dismiss-button
    :title="`Score after round ${round}`"
  >
    <div class="flex flex-col gap-3">
      <PlayerLobby
        v-for="player in players.slice().sort((a, b) => b.points - a.points)"
        :player="player"
        display-points
        :key="player.id"
      />
    </div>
  </Modal>
</template>
