<script setup lang="ts">
import { DrawingApi } from '@/api/drawing/drawing.api';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Panel from '@/components/Panel/Panel.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';
import { handleNetworkError } from '@/helpers/errors';
import { PencilSquareIcon } from '@heroicons/vue/20/solid';
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { ref, watch } from 'vue';
import DeleteModal from './DeleteModal.vue';
import ChangeWordTypeModal from './ChangeWordTypeModal.vue';
import type { WordType } from '@/api/drawing/drawing.api.interface';
import { useModalStore } from '@/stores/modal/modalStore';
import { QueryKeys } from '@/api/query-keys';

const addingWordType = ref({ type: '', price: 0 });
const changingWordType = ref<WordType | undefined>(undefined);
const deletingWordTypeId = ref<number | undefined>(undefined);

const queryClient = useQueryClient();

const { data, isError, error, isLoading } = useQuery({
  queryKey: [QueryKeys.WordTypes],
  queryFn: () => DrawingApi.getWordTypes()
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

const { mutate: addWordType, isPending: isPendingAdd } = useMutation({
  mutationFn: () => DrawingApi.addWordType(addingWordType.value),
  onSuccess: (wordType) => {
    addingWordType.value = { type: '', price: 0 };
    queryClient.setQueryData([QueryKeys.WordTypes], [...(data.value || []), wordType]);
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const { mutate: deleteWordType, isPending: isPendingDelete } = useMutation({
  mutationFn: () => DrawingApi.deleteWordType(deletingWordTypeId.value || -1),
  onSuccess: (wordType) => {
    queryClient.setQueryData(
      [QueryKeys.WordTypes],
      data.value?.filter((wt) => wt.id !== wordType.id) || []
    );
    deletingWordTypeId.value = undefined;
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const { mutate: changeWordType, isPending: isPendingChange } = useMutation({
  mutationFn: (wordType: WordType) => DrawingApi.updateWordType(wordType),
  onSuccess: (wordType) => {
    const index = data.value?.findIndex((wt) => wt.id === wordType.id);
    if (index === -1) {
      return;
    }
    queryClient.setQueryData(
      [QueryKeys.WordTypes],
      data.value?.map((wt) => (wt.id !== wordType.id ? wt : wordType)) || []
    );
    changingWordType.value = undefined;
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const handleChangeWordType = () => {
  if (!changingWordType.value) {
    return;
  }
  changeWordType(changingWordType.value);
};
</script>

<template>
  <SpinnerCenter v-if="isLoading" />
  <div
    v-else-if="isError"
    class="mx-auto"
  >
    Error message: {{ error }}
  </div>
  <div
    v-else
    class="flex flex-col grow gap-1 px-3"
  >
    <Panel
      v-if="data?.length"
      no-padding
    >
      <form
        @submit.prevent="() => addWordType()"
        class="flex"
      >
        <input
          v-model.trim="addingWordType.type"
          name="add-word-type"
          required
          class="w-full rounded-lg py-1.5 px-3 placeholder:text-gray-400 leading-4 rounded-r-none"
        />
        <div class="w-5 bg-blue-dark" />
        <input
          type="number"
          v-model.number="addingWordType.price"
          name="add-word-price"
          required
          class="w-24 py-1.5 px-3"
        />
        <ButtonMain
          type="submit"
          class="rounded-l-none"
        >
          <Spinner
            v-if="isPendingAdd"
            class="w-6 h-6"
          />
          <PlusIcon
            v-else
            class="w-6 h-6"
          />
        </ButtonMain>
      </form>
    </Panel>
    <Panel
      no-padding
      class="overflow-auto"
    >
      <table class="w-full">
        <thead>
          <tr>
            <th class="p-2 w-36">ID</th>
            <th class="p-2 text-left">Type</th>
            <th class="p-2 text-center">Price</th>
            <th class="p-2 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="wordType in data"
            :key="wordType.id"
            class="border-t border-blue-dark"
          >
            <td class="p-2 text-center">
              {{ wordType.id }}
            </td>
            <td class="p-2">
              {{ wordType.type }}
            </td>
            <td class="p-2 text-center">
              {{ wordType.price }}
            </td>
            <td class="flex">
              <ButtonMain
                class="ml-auto"
                theme="primary"
                size="md"
                @click="changingWordType = { ...wordType }"
              >
                <PencilSquareIcon class="w-5 h-5" />
              </ButtonMain>
              <ButtonMain
                class="ml-0.5"
                theme="danger"
                size="md"
                @click="deletingWordTypeId = wordType.id"
              >
                <TrashIcon class="w-5 h-5" />
              </ButtonMain>
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>
    <DeleteModal
      entity-name="word type"
      :is-delete-modal-open="deletingWordTypeId !== undefined"
      :id="deletingWordTypeId"
      :is-loading="isPendingDelete"
      @pressed="deleteWordType()"
      @closed="deletingWordTypeId = undefined"
    />
    <ChangeWordTypeModal
      :is-change-modal-open="changingWordType !== undefined"
      :word-type="changingWordType"
      :is-loading="isPendingChange"
      @pressed="handleChangeWordType"
      @closed="changingWordType = undefined"
    />
  </div>
</template>
