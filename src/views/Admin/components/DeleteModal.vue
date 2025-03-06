<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Modal from '@/components/Modal/Modal.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import { TrashIcon } from '@heroicons/vue/24/outline';

defineProps<{
  isDeleteModalOpen: boolean;
  id: number | undefined;
  isLoading: boolean;
  entityName: string;
}>();

defineEmits(['pressed', 'closed']);
</script>

<template>
  <Modal
    :title="`Delete ${entityName}`"
    backdrop-dismiss
    size="sm"
    :is-open="isDeleteModalOpen"
    @close="$emit('closed')"
  >
    <p>
      Are you sure you want to delete <br />
      {{ entityName }} with ID {{ id }}?
    </p>

    <ButtonMain
      class="mt-4 w-full"
      theme="danger"
      :disabled="isLoading"
      @click="$emit('pressed')"
    >
      <Spinner v-if="isLoading" />
      <template v-else>
        <TrashIcon class="w-5 h-5 me-2" />
        Delete
      </template>
    </ButtonMain>
  </Modal>
</template>
