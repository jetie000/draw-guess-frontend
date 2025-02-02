<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import PlayerLobby from './PlayerLobby.vue';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import type { Profile } from '@/api/user/user.api.interface';
import { onMounted } from 'vue';
import type { Player } from '@/typings/interfaces/player.interface';
import { useQueryClient } from '@tanstack/vue-query';
import { socket } from '@/helpers/socket';

const props = defineProps<{ game: Game; user: Profile | undefined }>();

const queryClient = useQueryClient();

const handleCopyCode = async () => {
  await window.navigator.clipboard.writeText(props.game.code.toUpperCase());
  useAlertStore().showAlert('Copied to clipboard', AlertTypes.Success);
};

onMounted(() => {
  socket.on('joinedGame', (player: Player) => {
    if (!props.game.players.find((p) => p.user.id === player.user.id)) {
      queryClient.setQueryData(['game', String(props.game.id)], {
        ...props.game,
        players: [...props.game.players, player]
      });
    }
  });

  socket.on('leftGame', (userId) => {
    if (props.game) {
      queryClient.setQueryData(['game', String(props.game.id)], {
        ...props.game,
        players: props.game.players.filter((p) => p.user.id !== userId)
      });
    }
  });
});
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col gap-4 max-xsm:gap-3">
      <div class="flex justify-center flex-wrap gap-4 max-xsm:gap-3">
        <Panel
          class="flex flex-col text-center cursor-pointer max-xsm:w-full"
          @click="handleCopyCode"
        >
          <span class="text-xl">Game code</span>
          <span class="text-3xl font-bold my-3">{{ game.code.toUpperCase() }}</span>
          <span class="text-sm text-gray-secondary">Click to copy</span>
        </Panel>
        <Panel class="flex flex-col gap-3 max-xsm:w-full">
          <span class="text-xl">
            {{
              game.players.length === 1
                ? 'Waiting for players...'
                : 'Waiting for creator to start...'
            }}
          </span>
          <div class="flex justify-between gap-4 text-sm text-gray-secondary">
            <div class="flex flex-col gap-2">
              <span>Round Duration</span>
              <span>Players</span>
              <span>Drawings per player</span>
            </div>
            <div class="flex flex-col gap-2 font-bold text-blue-dark items-center">
              <span>{{ game.roundDuration }}s</span>
              <span>{{ game.players.length }}/{{ game.maxPlayers }}</span>
              <span>{{ game.drawingsPerPlayer }}</span>
            </div>
          </div>
        </Panel>
      </div>
      <ButtonMain
        v-if="user && game.creatorId === user.id && game.players.length > 1"
        size="lg"
      >
        Start game
      </ButtonMain>
      <Panel class="max-xsm:w-full">
        <div class="font-bold mb-2 text-center">Creator</div>
        <PlayerLobby :player="game.players.find((p) => p.user.id === game.creatorId)!" />
        <template v-if="game.players.length > 1">
          <hr class="my-4 -mx-4" />
          <PlayerLobby
            v-for="player in game.players.filter((p) => p.user.id !== game.creatorId)"
            :player="player"
            :key="player.user.id"
          />
        </template>
      </Panel>
    </div>
  </div>
</template>
