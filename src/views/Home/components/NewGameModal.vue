<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue';
import { ref, watch } from 'vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import { useRouter } from 'vue-router';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useMutation } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';

defineProps<{
  isNewModalOpen: boolean;
}>();
defineEmits(['toggle']);

const alertStore = useAlertStore();
const router = useRouter();

const players = ref(2);
const roundDuration = ref(30);
const drawingsPerPlayer = ref(1);
const isPrivate = ref(true);

const { isPending, mutate } = useMutation({
  mutationFn: () =>
    GameApi.createGame(
      players.value,
      roundDuration.value,
      drawingsPerPlayer.value,
      isPrivate.value
    ),
  onSuccess: (data) => {
    router.push({ name: 'Game', params: { id: data } });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

watch([players, drawingsPerPlayer], () => {
  if (players.value * drawingsPerPlayer.value > 12) {
    alertStore.showAlert("Maximum amount of drawings can't be more than 12", AlertTypes.Warning);
    drawingsPerPlayer.value = Math.floor(12 / players.value);
  }
});
</script>

<template>
  <Modal
    title="Create a new game"
    :is-open="isNewModalOpen"
    @close="$emit('toggle')"
  >
    <div class="grid grid-cols-2 items-center gap-2">
      <div class="flex justify-center items-center col-end-3 col-start-1 mb-1">
        <div class="bg-gray-200 rounded-lg w-full">
          <div class="inline-flex rounded-lg w-1/2">
            <input
              type="radio"
              v-model="isPrivate"
              :value="true"
              name="room_type"
              id="roomPrivate"
              checked
              hidden
            />
            <label
              for="roomPrivate"
              class="radio grow text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
            >
              Private
            </label>
          </div>
          <div class="inline-flex rounded-lg w-1/2">
            <input
              type="radio"
              v-model="isPrivate"
              :value="false"
              name="room_type"
              id="roomPublic"
              hidden
            />
            <label
              for="roomPublic"
              class="radio grow text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
            >
              Public
            </label>
          </div>
        </div>
      </div>
      <label
        for="players-range"
        class="text-md flex justify-between items-center gap-3"
      >
        Maximum players <b>{{ players }}</b>
      </label>
      <input
        v-model="players"
        id="players-range"
        type="range"
        max="12"
        min="2"
        class="w-full h-1 bg-gray-300 appearance-none cursor-pointer"
      />
      <label
        for="duration-range"
        class="text-md flex justify-between items-center gap-3"
      >
        Round duration <b>{{ roundDuration }}s</b>
      </label>
      <input
        v-model="roundDuration"
        id="duration-range"
        type="range"
        max="120"
        min="10"
        step="5"
        class="w-full h-1 bg-gray-300 appearance-none cursor-pointer"
      />
      <label
        for="drawings-range"
        class="text-md flex justify-between items-center gap-3"
      >
        Drawings per player <b>{{ drawingsPerPlayer }}</b>
      </label>
      <input
        v-model="drawingsPerPlayer"
        id="drawings-range"
        type="range"
        :max="Math.floor(12 / players)"
        min="1"
        class="w-full h-1 bg-gray-300 appearance-none cursor-pointer"
      />
    </div>
    <ButtonMain
      class="w-full mt-5"
      @click="mutate()"
    >
      <Spinner v-if="isPending" />
      <span v-else>Create game</span>
    </ButtonMain>
  </Modal>
</template>

<style scoped lang="scss">
input:checked ~ .radio {
  color: white;
  background-color: $blue-light;
}
</style>
