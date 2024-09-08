<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Modal from '@/components/Modal/Modal.vue';
import { ref } from 'vue';
import { useJoinGame } from '../api/useJoinGame';
import { useRouter } from 'vue-router';
import Spinner from '@/components/Spinner/Spinner.vue';

defineProps<{
  isJoinModalOpen: boolean;
}>();
defineEmits(['toggle']);

const { isLoading, isSuccess, joinGame } = useJoinGame();
const router = useRouter();

const gameCode = ref('');

const handleJoinGame = async () => {
  const gameId = await joinGame(gameCode.value);
  if (isSuccess && gameId) {
    router.push({ name: 'Game', params: { id: gameId } });
  }
};
</script>

<template>
  <Modal
    title="Join a game"
    :size="'sm'"
    :is-open="isJoinModalOpen"
    @close="$emit('toggle')"
  >
    <h1>Enter game code</h1>
    <div class="mt-2">
      <input
        v-model="gameCode"
        name="code"
        type="text"
        required
        class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
      />
    </div>
    <ButtonMain
      class="mt-3 w-full"
      @click="handleJoinGame"
    >
      <Spinner v-if="isLoading" />
      <span v-else>Join</span>
    </ButtonMain>
  </Modal>
</template>
