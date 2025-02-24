<script setup lang="ts">
import { getAlertColorClass } from '@/helpers/alert';
import { useAlertStore } from '@/stores/alert/alertStore';
import { storeToRefs } from 'pinia';
import {
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/20/solid';
import { AlertTypes } from '@/typings/enums/alert';

const getAlertIcon = (type: AlertTypes) => {
  switch (type) {
    case AlertTypes.Info:
      return InformationCircleIcon;
    case AlertTypes.Success:
      return CheckCircleIcon;
    case AlertTypes.Warning:
      return ExclamationTriangleIcon;
    case AlertTypes.Error:
      return XCircleIcon;
    default:
      return InformationCircleIcon;
  }
};

const alertStore = useAlertStore();
const { isAlertOpen, message, type } = storeToRefs(alertStore);
</script>

<template>
  <div
    :class="`${isAlertOpen ? 'opacity-100' : 'opacity-0'} ${isAlertOpen ? 'z-10' : '-z-10'} flex flex-col fixed bottom-4 right-4 max-w-xs min-w-48 bg-white border border-blue-dark rounded-xl shadow-lg transition-all duration-500`"
    role="alert"
    tabindex="-1"
  >
    <div class="flex py-2 px-3">
      <component
        :class="`${getAlertColorClass(type)} shrink-0 w-5 h-5`"
        :is="getAlertIcon(type)"
      />
      <div class="ms-2.5 text-sm font-bold">
        <p class="text-gray-700">
          {{ type }}
        </p>
      </div>
      <button
        class="w-5 h-5 ms-auto shrink-0 hover:bg-blue-dark hover:bg-opacity-20 transition-colors rounded-full"
        @click="alertStore.hideAlert"
      >
        <XMarkIcon />
      </button>
    </div>
    <hr />
    <div class="text-sm py-2 px-3">{{ message }}</div>
  </div>
</template>
