<script setup lang="ts">
import type { Word, WordType } from '@/api/drawing/drawing.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import InputMain from '@/components/Input/InputMain.vue';
import Modal from '@/components/Modal/Modal.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

defineProps<{
  isChangeModalOpen: boolean;
  isLoading: boolean;
  wordTypes: WordType[] | undefined;
}>();

defineModel<Word | undefined>('word');

defineEmits(['pressed', 'closed']);
</script>

<template>
  <Modal
    title="Change word"
    backdrop-dismiss
    size="sm"
    :is-open="isChangeModalOpen"
    @close="$emit('closed')"
  >
    <form
      v-if="word"
      class="flex flex-col"
      @submit.prevent="$emit('pressed')"
    >
      <p class="p-1 m-1">ID: {{ word.id }}</p>
      <InputMain
        v-model.trim="word.word"
        name="change-word-word"
        required
      />
      <select
        class="bg-blue-dark mt-2 text-white px-3 py-1.5 rounded-md focus-visible:outline-none"
        v-model="word.typeId"
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
        class="mt-4 w-full"
        :disabled="isLoading"
        type="submit"
      >
        <Spinner v-if="isLoading" />
        <template v-else> Change </template>
      </ButtonMain>
    </form>
  </Modal>
</template>
