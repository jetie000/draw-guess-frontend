<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import VOtpInput from 'vue3-otp-input';
import { useRequestCode } from '../api/useRequestCode';
import { useResetPassword } from '../api/useResetPassword';
import Spinner from '@/components/Spinner/Spinner.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';

const email = ref('');
const code = ref('');
const password = ref('');

const router = useRouter();
const alertStore = useAlertStore();

const { requestCode, isLoading: isLoadingRequest, isSuccess: isSuccessRequest } = useRequestCode();
const { resetPassword, isLoading: isLoadingReset, isSuccess: isSuccessReset } = useResetPassword();

const buttonTitle = computed(() => (isSuccessRequest.value ? 'Change password' : 'Reset password'));

const onSubmit = async () => {
  if (!isSuccessRequest.value) {
    await requestCode(email.value);
    if (isSuccessRequest.value) {
      alertStore.showAlert('Code sent to your email');
    }
  } else {
    await resetPassword(email.value, code.value, password.value);
    if (isSuccessReset.value) {
      alertStore.showAlert('Password changed successfully');
      router.push('/login');
    }
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
        <input
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :disabled="isSuccessRequest"
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
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
          <input
            v-model="password"
            name="password"
            type="password"
            required
            class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
          />
        </div>
      </div>
    </template>
    <ButtonMain
      type="submit"
      class="w-full"
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
