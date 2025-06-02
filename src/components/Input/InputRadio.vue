<script setup lang="ts">
defineProps<{
  name: string;
  radioValues: { label: string; value: string | number; id: string }[];
}>();

defineModel<string | number>();
</script>

<template>
  <div class="flex gap-3">
    <div
      v-for="radio in radioValues"
      class="inline-flex items-center"
      :key="radio.id"
    >
      <label
        class="relative flex items-center cursor-pointer"
        :for="`${radio.id}-radio-id`"
      >
        <input
          :id="`${radio.id}-radio-id`"
          :name="name"
          type="radio"
          class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-main checked:border-gray-secondary transition-all"
          :value="radio.value"
          :checked="modelValue === radio.value"
          @input="
            $emit(
              'update:modelValue',
              typeof radio.value === 'number'
                ? Number(($event.target as HTMLInputElement).value)
                : ($event.target as HTMLInputElement).value
            )
          "
        />
        <span
          class="absolute bg-blue-dark w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
        </span>
      </label>
      <label
        class="pl-2 text-blue-dark cursor-pointer"
        :for="`${radio.id}-radio-id`"
      >
        {{ radio.label }}
      </label>
    </div>
  </div>
</template>
