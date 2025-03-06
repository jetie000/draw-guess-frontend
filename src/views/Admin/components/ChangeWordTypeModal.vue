<script setup lang="ts">
import type { WordType } from '@/api/drawing/drawing.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import InputMain from '@/components/Input/InputMain.vue';
import Modal from '@/components/Modal/Modal.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

defineProps<{
  isChangeModalOpen: boolean;
  isLoading: boolean;
}>();

defineModel<WordType | undefined>('wordType');

defineEmits(['pressed', 'closed']);
</script>

<template>
  <Modal
    title="Change word type"
    backdrop-dismiss
    size="sm"
    :is-open="isChangeModalOpen"
    @close="$emit('closed')"
  >
    <form
      class="flex flex-col"
      @submit.prevent="$emit('pressed')"
    >
      <p class="p-1 m-1">ID: {{ wordType?.id }}</p>
      <InputMain
        v-if="wordType"
        v-model.trim="wordType.type"
        name="change-word-type-name"
        required
      />
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
