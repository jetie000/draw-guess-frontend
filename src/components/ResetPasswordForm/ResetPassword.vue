<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import VOtpInput from 'vue3-otp-input';
import Spinner from '@/components/Spinner/Spinner.vue';
import { useMutation } from '@tanstack/vue-query';
import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import InputMain from '@/components/Input/InputMain.vue';

const props = defineProps<{
  userEmail?: string;
}>();

const email = ref(props.userEmail || '');
const code = ref('');
const password = ref('');

const router = useRouter();
const alertStore = useAlertStore();

const buttonTitle = computed(() => (isSuccessRequest.value ? 'Change password' : 'Reset password'));

const {
  isPending: isLoadingRequest,
  mutate: requestCode,
  isSuccess: isSuccessRequest,
  reset
} = useMutation({
  mutationFn: () => UserApi.requestCode(email.value),
  onSuccess: () => {
    alertStore.showAlert('Code sent to your email');
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const { isPending: isLoadingReset, mutate: resetPassword } = useMutation({
  mutationFn: () => UserApi.resetPassword(email.value, code.value, password.value),
  onSuccess: () => {
    alertStore.showAlert('Password changed successfully');
    if (!props.userEmail) {
      router.push('/login');
    } else {
      code.value = '';
      password.value = '';
      reset();
    }
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const onSubmit = async () => {
  if (!isSuccessRequest.value) {
    requestCode();
  } else {
    resetPassword();
  }
};
</script>

<template>
  <form
    class="space-y-3"
    @submit.prevent="onSubmit"
  >
    <div>
      <label
        for="email"
        class="block text-sm font-medium"
      >
        Email address
      </label>
      <div class="mt-1">
        <InputMain
          v-model.trim="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :disabled="isSuccessRequest || userEmail"
        />
      </div>
    </div>
    <template v-if="isSuccessRequest">
      <div>
        <label
          for="code"
          class="block text-sm font-medium"
        >
          Code
        </label>
        <div class="mt-1">
          <v-otp-input
            :num-inputs="6"
            v-model:value="code"
            input-classes="otp-input rounded-md"
            inputType="letter-numeric"
            inputmode="text"
          />
        </div>
      </div>
      <div>
        <label
          for="password"
          class="block text-sm font-medium"
        >
          New password
        </label>
        <div class="mt-1">
          <InputMain
            v-model.trim="password"
            name="password"
            type="password"
            required
          />
        </div>
      </div>
    </template>
    <ButtonMain
      type="submit"
      class="w-full"
      :disabled="isLoadingRequest || isLoadingReset"
    >
      <Spinner v-if="isLoadingRequest || isLoadingReset" />
      <span v-else>{{ buttonTitle }}</span>
    </ButtonMain>
  </form>
</template>

<style lang="scss">
.otp-input-container {
  justify-content: space-between;
  gap: 10px;

  & > div {
    .otp-input {
      height: 34px;
      width: 100%;
      font-size: 22px;
      border: 1px solid $gray-main;
      text-align: center;
      text-transform: uppercase;

      &.disabled {
        background-color: color-mix(in srgb, $white 100%, $yellow-secondary 30%);
        pointer-events: none;
      }
    }
  }
}
</style>
