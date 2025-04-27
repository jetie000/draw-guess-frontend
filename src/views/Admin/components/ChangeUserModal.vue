<script setup lang="ts">
import type { PatchUserRequestAdmin } from '@/api/user/user.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import InputCheckbox from '@/components/Input/InputCheckbox.vue';
import InputMain from '@/components/Input/InputMain.vue';
import InputRadio from '@/components/Input/InputRadio.vue';
import Modal from '@/components/Modal/Modal.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import { UserRoles } from '@/typings/enums/user';

defineProps<{
  isChangeModalOpen: boolean;
  isLoading: boolean;
}>();

defineModel<PatchUserRequestAdmin | undefined>('user');

defineEmits(['pressed', 'closed']);
</script>

<template>
  <Modal
    title="Change user"
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
        ID: <span class="font-bold">{{ user?.id }}</span>
      </p>
      <template v-if="user">
        <div>
          <label
            class="text-sm"
            for="change-username"
          >
            Username
          </label>
          <InputMain
            v-model.trim="user.username"
            class="mt-1"
            name="change-username"
            required
          />
        </div>
        <div>
          <label
            class="text-sm"
            for="change-password"
          >
            New password
          </label>
          <InputMain
            v-model.trim="user.password"
            class="mt-1"
            name="change-password"
          />
        </div>
        <div>
          <label
            class="text-sm"
            for="change-role"
          >
            Role
          </label>
          <InputRadio
            name="change-role"
            v-model="user.role"
            class="mt-1"
            is-number-values
            :radio-values="[
              { id: 'user', label: 'User', value: UserRoles.User },
              { id: 'admin', label: 'Admin', value: UserRoles.Admin }
            ]"
          />
        </div>
        <InputCheckbox
          class="mt-2"
          v-model="user.access"
          name="change-access"
          label="Access"
        />
      </template>
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
