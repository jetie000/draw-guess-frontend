<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDrawingStore } from '../stores/drawingStore';
import { colors, strokeWidths } from '@/helpers/constants';
import paper from 'paper';
import Panel from '@/components/Panel/Panel.vue';

const path = defineModel<paper.Path>('path');

const { color, strokeWidth } = storeToRefs(useDrawingStore());

const handleChangeColor = (colorString: string) => {
  color.value = colorString;
  if (!path.value) {
    return;
  }
  path.value.strokeColor = new paper.Color(color.value);
};

const handleChangeStrokeWidth = (width: number) => {
  strokeWidth.value = width;
  if (!path.value) {
    return;
  }
  path.value.strokeWidth = width;
};
</script>

<template>
  <Panel class="flex flex-col gap-4 max-xsm:w-full">
    <div class="grid grid-cols-5 gap-3 justify-items-center">
      <div
        v-for="colorValue in colors"
        class="w-7 h-7 rounded-full border border-blue-dark cursor-pointer flex items-center justify-center"
        :style="{
          backgroundColor: colorValue
        }"
        :key="colorValue"
        @click="handleChangeColor(colorValue)"
      >
        <img
          v-if="colorValue === color"
          class="w-4 h-4"
          src="@/assets/duck-icon.svg"
          alt="Duck"
        />
      </div>
    </div>
    <hr class="-mx-4" />
    <div class="grid grid-cols-5 gap-3 justify-items-center items-center">
      <div
        v-for="strokeWidthValue in strokeWidths"
        class="bg-blue-dark rounded-full relative"
        :style="{ width: `${strokeWidthValue}px`, height: `${strokeWidthValue}px` }"
        :key="strokeWidthValue"
      />
    </div>
    <input
      :value="strokeWidth"
      id="stroke-width-range"
      type="range"
      :max="strokeWidths[strokeWidths.length - 1]"
      :min="strokeWidths[0]"
      :step="strokeWidths[1] - strokeWidths[0]"
      class="h-1 bg-gray-300 appearance-none cursor-pointer mx-3"
      @change="handleChangeStrokeWidth(Number(($event.target as HTMLInputElement).value))"
    />
  </Panel>
</template>
