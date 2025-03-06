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
import ChangeWordModal from './ChangeWordModal.vue';
import type { Word } from '@/api/drawing/drawing.api.interface';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';

const addingWord = ref<Omit<Word, 'id'>>({ typeId: -1, word: '' });
const changingWord = ref<Word | undefined>(undefined);
const deletingWordId = ref<number | undefined>(undefined);

const queryClient = useQueryClient();

const { data, isError, error, isLoading } = useQuery({
  queryKey: ['words'],
  queryFn: () => DrawingApi.getWords()
});

watch(isLoading, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
});

const {
  data: wordTypes,
  isError: isErrorWordTypes,
  error: errorWordTypes,
  isLoading: isLoadingWordTypes
} = useQuery({
  queryKey: ['word-types'],
  queryFn: () => DrawingApi.getWordTypes()
});

watch(isLoadingWordTypes, () => {
  if (isErrorWordTypes.value) {
    useErrorModalStore().showModal(errorWordTypes.value);
  }
});

const { mutate: addWord, isPending: isPendingAdd } = useMutation({
  mutationFn: () => DrawingApi.addWord(addingWord.value.word, addingWord.value.typeId),
  onSuccess: (word) => {
    addingWord.value = { typeId: -1, word: '' };
    queryClient.setQueryData(
      ['words'],
      [
        ...(data.value || []),
        { ...word, type: wordTypes.value?.find((wt) => wt.id === word.typeId)?.type }
      ]
    );
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const { mutate: deleteWord, isPending: isPendingDelete } = useMutation({
  mutationFn: () => DrawingApi.deleteWord(deletingWordId.value || -1),
  onSuccess: (word) => {
    queryClient.setQueryData(['words'], data.value?.filter((wt) => wt.id !== word.id) || []);
    deletingWordId.value = undefined;
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const { mutate: changeWord, isPending: isPendingChange } = useMutation({
  mutationFn: () =>
    DrawingApi.updateWord(
      changingWord.value?.id || -1,
      changingWord.value?.word || '',
      changingWord.value?.typeId || 1
    ),
  onSuccess: (word) => {
    const index = data.value?.findIndex((wt) => wt.id === word.id);
    if (index === -1) {
      return;
    }
    queryClient.setQueryData(
      ['words'],
      data.value?.map((w) =>
        w.id !== word.id
          ? w
          : { ...word, type: wordTypes.value?.find((wt) => wt.id === word.typeId) }
      ) || []
    );
    changingWord.value = undefined;
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});
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
    <Panel no-padding>
      <form
        @submit.prevent="() => addWord()"
        class="flex"
      >
        <input
          v-model.trim="addingWord.word"
          name="add-word"
          required
          class="w-full rounded-lg py-1.5 px-3 placeholder:text-gray-400 leading-4 rounded-r-none"
        />
        <select
          class="bg-blue-dark text-white text-sm rounded-none p-2.5 focus-visible:outline-none"
          v-model="addingWord.typeId"
        >
          <option
            value="-1"
            hidden
            selected
          >
            Choose a type
          </option>
          <option
            v-for="wordType in wordTypes"
            :key="wordType.id"
            :value="wordType.id"
          >
            {{ wordType.type }}
          </option>
        </select>
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
      v-if="data?.length"
      no-padding
    >
      <table class="w-full">
        <thead>
          <tr>
            <th class="p-2 w-36">ID</th>
            <th class="p-2 text-left">Word</th>
            <th class="p-2 text-left">Type</th>
            <th class="p-2 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="word in data"
            :key="word.id"
            class="border-t border-blue-dark"
          >
            <td class="p-2 text-center">
              {{ word.id }}
            </td>
            <td class="p-2">
              {{ word.word }}
            </td>
            <td class="p-2">
              {{ word.type.type }}
            </td>
            <td class="flex">
              <ButtonMain
                class="ml-auto"
                theme="primary"
                size="md"
                @click="changingWord = { ...word, typeId: word.type.id }"
              >
                <PencilSquareIcon class="w-5 h-5" />
              </ButtonMain>
              <ButtonMain
                class="ml-0.5"
                theme="danger"
                size="md"
                @click="deletingWordId = word.id"
              >
                <TrashIcon class="w-5 h-5" />
              </ButtonMain>
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>
    <DeleteModal
      entity-name="word"
      :is-delete-modal-open="deletingWordId !== undefined"
      :id="deletingWordId"
      :is-loading="isPendingDelete"
      @pressed="deleteWord()"
      @closed="deletingWordId = undefined"
    />
    <ChangeWordModal
      :is-change-modal-open="changingWord !== undefined"
      :word="changingWord"
      :word-types="wordTypes"
      :is-loading="isPendingChange"
      @pressed="changeWord()"
      @closed="changingWord = undefined"
    />
  </div>
</template>
