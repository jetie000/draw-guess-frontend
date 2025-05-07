<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue';
import { computed, ref, watch } from 'vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import { useRouter } from 'vue-router';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { GameApi } from '@/api/game/game.api';
import { handleNetworkError } from '@/helpers/errors';
import { DrawingApi } from '@/api/drawing/drawing.api';
import { useModalStore } from '@/stores/modal/modalStore';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { QueryKeys } from '@/api/query-keys';

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
const isSimplified = ref(false);
const wordTypeIds = ref<number[]>([]);

const { data, isError, error, isLoading } = useQuery({
  queryKey: [QueryKeys.WordTypes],
  queryFn: () => DrawingApi.getWordTypes()
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

const { isPending, mutate } = useMutation({
  mutationFn: () =>
    GameApi.createGame(
      players.value,
      roundDuration.value,
      drawingsPerPlayer.value,
      isPrivate.value,
      isSimplified.value,
      wordTypeIds.value
    ),
  onSuccess: (data) => {
    router.push({ name: 'Game', params: { id: data } });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const wordTypesLabel = computed(() =>
  wordTypeIds.value.map((id) => data.value?.find((wt) => wt.id === id)?.type).join(', ')
);

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
              v-model="isSimplified"
              :value="false"
              name="room-difficulty-type"
              id="room-standard"
              checked
              hidden
            />
            <label
              for="room-standard"
              class="radio grow text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
            >
              Standard
            </label>
          </div>
          <div class="inline-flex rounded-lg w-1/2">
            <input
              type="radio"
              v-model="isSimplified"
              :value="true"
              name="room-difficulty-type"
              id="room-simplified"
              hidden
            />
            <label
              for="room-simplified"
              class="radio grow text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
            >
              Simplified
            </label>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center col-end-3 col-start-1 mb-1">
        <div class="bg-gray-200 rounded-lg w-full">
          <div class="inline-flex rounded-lg w-1/2">
            <input
              type="radio"
              v-model="isPrivate"
              :value="true"
              name="room-type"
              id="room-private"
              checked
              hidden
            />
            <label
              for="room-private"
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
              name="room-type"
              id="room-public"
              hidden
            />
            <label
              for="room-public"
              class="radio grow text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75"
            >
              Public
            </label>
          </div>
        </div>
      </div>
      <Dropdown class="col-end-3 mb-1 col-start-1">
        <template #trigger>
          <div
            class="w-full bg-blue-light rounded-lg text-white p-2.5 px-4 cursor-pointer flex items-center justify-between"
          >
            {{ wordTypeIds.length === 0 ? 'Choose word types' : wordTypesLabel }}
            <ChevronDownIcon class="w-5 h-5" />
          </div>
        </template>
        <div class="flex bg-white border rounded-md py-2 flex-col">
          <label
            v-for="wordType in data"
            :key="wordType.id"
            :value="wordType.id"
            :for="`word-type-${wordType.id}`"
            class="cursor-pointer hover:bg-blue-100 px-4"
          >
            <div class="flex items-center justify-between gap-4 py-1">
              <span>{{ wordType.type }}</span>
              <input
                :id="`word-type-${wordType.id}`"
                class="w-4 h-4 bg-white border-gray-main cursor-pointer"
                type="checkbox"
                :checked="wordTypeIds.includes(wordType.id)"
                @input="
                  wordTypeIds.includes(wordType.id)
                    ? wordTypeIds.splice(wordTypeIds.indexOf(wordType.id), 1)
                    : wordTypeIds.push(wordType.id)
                "
              />
            </div>
          </label>
        </div>
      </Dropdown>
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
      :disabled="wordTypeIds.length === 0"
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
