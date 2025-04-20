<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Modal from '@/components/Modal/Modal.vue';
import { useRouter } from 'vue-router';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useMutation } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';
import { TrashIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline';
import { socket } from '@/helpers/socket';
import { SocketEmitKeys } from '@/helpers/socket/emit-keys';

const props = defineProps<{
  isDeleteModalOpen: boolean;
  gameId: number;
  isCreator: boolean;
  userId: number;
  isPrivate: boolean;
}>();
defineEmits(['close']);

const router = useRouter();

const { isPending, mutate } = useMutation({
  mutationFn: () => GameApi.deleteGame(props.gameId),
  onSuccess: () => {
    if (props.isCreator) {
      socket.emit(SocketEmitKeys.DeleteGame, { room: props.gameId });
      if (!props.isPrivate) {
        socket.emit(SocketEmitKeys.DeleteGamePublic, { room: props.gameId });
      }
    } else {
      socket.emit(SocketEmitKeys.LeaveGame, { room: props.gameId, userId: props.userId });
      if (!props.isPrivate) {
        socket.emit(SocketEmitKeys.LeaveGamePublic, { room: props.gameId, userId: props.userId });
      }
    }
    router.push({ name: 'Home' });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});
</script>

<template>
  <Modal
    title="Delete game"
    size="sm"
    :is-open="isDeleteModalOpen"
    @close="$emit('close')"
  >
    <p>
      Are you sure you want to {{ isCreator ? 'delete' : 'leave' }} game <b>#{{ gameId }}</b> ?
    </p>

    <ButtonMain
      class="mt-4 w-full"
      theme="danger"
      @click="mutate()"
    >
      <Spinner v-if="isPending" />
      <template v-else>
        <template v-if="isCreator">
          <TrashIcon class="w-5 h-5 me-2" />
          Delete Game
        </template>
        <template v-else>
          <ArrowLeftStartOnRectangleIcon class="w-5 h-5 me-2" />
          Leave Game
        </template>
      </template>
    </ButtonMain>
  </Modal>
</template>
