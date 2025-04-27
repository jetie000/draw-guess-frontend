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
      class="flex flex-col gap-2"
      @submit.prevent="$emit('pressed')"
    >
      <p class="pl-1 text-lg">
        ID: <span class="font-bold">{{ wordType?.id }}</span>
      </p>
      <InputMain
        v-if="wordType"
        v-model.trim="wordType.type"
        name="change-word-type-name"
        required
      />
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
