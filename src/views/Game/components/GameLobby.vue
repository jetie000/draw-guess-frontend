<script setup lang="ts">
import type { Game } from '@/api/game/game.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import PlayerLobby from './PlayerLobby.vue';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import type { Profile } from '@/api/user/user.api.interface';
import { onMounted, onUnmounted, ref } from 'vue';
import type { Player } from '@/typings/interfaces/player.interface';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { socket } from '@/helpers/socket';
import { TrashIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline';
import DeleteGameModal from './DeleteGameModal.vue';
import { useRouter } from 'vue-router';
import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';
import Spinner from '@/components/Spinner/Spinner.vue';

const props = defineProps<{ game: Game; user: Profile }>();

const isDeleteModalOpen = ref(false);

const router = useRouter();
const queryClient = useQueryClient();

const { mutate, isPending } = useMutation({
  mutationFn: () => GameApi.startGame(props.game.id),
  onError: (error) => {
    handleNetworkError(error);
  }
});

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

  socket.on('deletedGame', () => {
    router.push({ name: 'Home' });
    useAlertStore().showAlert('Game has been deleted', AlertTypes.Warning);
  });

  socket.on('gameStarted', (startDate: string) => {
    queryClient.setQueryData(['game', String(props.game.id)], {
      ...props.game,
      startDate
    });
  });
});

onUnmounted(() => {
  socket.off('joinedGame');
  socket.off('leftGame');
  socket.off('deletedGame');
  socket.off('gameStarted');
});
</script>

<template>
  <div class="flex justify-center p-5">
    <div class="flex flex-col gap-4 max-xsm:gap-3">
      <div class="flex justify-center flex-wrap gap-4 max-xsm:gap-3">
        <Panel
          class="flex flex-col text-center cursor-pointer max-xsm:w-full justify-center min-w-48"
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
          </div>
        </Panel>
      </div>
      <ButtonMain
        v-if="user && game.creatorId === user.id && game.players.length > 1"
        size="lg"
        :disabled="isPending"
        @click="mutate"
      >
        <Spinner v-if="isPending" />
        <span v-else> Start game </span>
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
      <ButtonMain
        class="p-1"
        theme="danger"
        size="lg"
        @click.stop="isDeleteModalOpen = true"
      >
        <template v-if="game.creatorId === user.id">
          <TrashIcon class="w-5 h-5 me-2" />
          Delete Game
        </template>
        <template v-else>
          <ArrowLeftStartOnRectangleIcon class="w-5 h-5 me-2" />
          Leave Game
        </template>
      </ButtonMain>
    </div>
    <DeleteGameModal
      :game-id="game.id"
      :is-creator="game.creatorId === user.id"
      :user-id="user.id"
      :is-delete-modal-open="isDeleteModalOpen"
      :is-private="game.isPrivate"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
