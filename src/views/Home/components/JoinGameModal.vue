<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Modal from '@/components/Modal/Modal.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useMutation } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';
import InputMain from '@/components/Input/InputMain.vue';

defineProps<{
  isJoinModalOpen: boolean;
}>();
defineEmits(['close']);

const router = useRouter();

const gameCode = ref('');

const { isPending, mutate } = useMutation({
  mutationFn: () => GameApi.joinGame(gameCode.value),
  onSuccess: (data) => {
    router.push({ name: 'Game', params: { id: data } });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});
</script>

<template>
  <Modal
    title="Join a game"
    size="sm"
    :is-open="isJoinModalOpen"
    @close="$emit('close')"
  >
    <h1>Enter game code</h1>
    <form @submit.prevent="mutate()">
      <div class="mt-2">
        <InputMain
          v-model.trim="gameCode"
          name="code"
          type="text"
          required
        />
      </div>
      <ButtonMain
        :disabled="isPending || gameCode.length !== 6"
        type="submit"
        class="mt-3 w-full"
      >
        <Spinner v-if="isPending" />
        <span v-else>Join</span>
      </ButtonMain>
    </form>
  </Modal>
</template>
