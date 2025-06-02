<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    radioValues: { label: string; value: string | number | boolean; id: string }[];
    isVertical?: boolean;
  }>(),
  {
    isVertical: false
  }
);

defineModel<string | number | boolean>();
</script>

<template>
  <div class="bg-gray-200 rounded-lg w-full">
    <div
      v-for="radio in radioValues"
      :key="radio.id"
      class="inline-flex rounded-lg"
      :style="`width: ${isVertical ? '100%' : `${100 / radioValues.length}%`}`"
    >
      <input
        type="radio"
        :value="radio.value"
        :checked="modelValue === radio.value"
        :name="name"
        :id="`${radio.id}-radio-id`"
        hidden
        @input="
          $emit(
            'update:modelValue',
            typeof radio.value === 'number'
              ? Number(($event.target as HTMLInputElement).value)
              : typeof radio.value === 'boolean'
                ? ($event.target as HTMLInputElement).value === 'true'
                : ($event.target as HTMLInputElement).value
          )
        "
      />
      <label
        :for="`${radio.id}-radio-id`"
        class="radio grow text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75 text-nowrap"
      >
        {{ radio.label }}
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
input:checked ~ .radio {
  color: white;
  background-color: $blue-light;
}
</style>
