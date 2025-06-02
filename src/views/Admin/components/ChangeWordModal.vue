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
      class="flex flex-col gap-2"
      @submit.prevent="$emit('pressed')"
    >
      <p class="pl-1 text-lg">
        ID: <span class="font-bold">{{ word?.id }}</span>
      </p>
      <div>
        <label
          class="text-sm"
          for="change-word-word"
        >
          Word
        </label>
        <InputMain
          v-model.trim="word.word"
          class="mt-1"
          name="change-word-word"
          required
        />
      </div>
      <div>
        <label
          class="text-sm"
          for="change-word-type"
        >
          Type
        </label>
        <select
          name="change-word-type"
          class="bg-blue-dark text-white px-3 py-1.5 rounded-md focus-visible:outline-none block w-full mt-1"
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
      </div>
      <ButtonMain
        class="mt-3 w-full"
        :disabled="isLoading"
        type="submit"
      >
        <Spinner v-if="isLoading" />
        <template v-else> Change </template>
      </ButtonMain>
    </form>
  </Modal>
</template>
