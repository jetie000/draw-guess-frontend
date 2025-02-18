<script setup lang="ts">
import paper from 'paper';
import { onMounted, ref } from 'vue';
import { useDrawingStore } from '../stores/drawingStore';
import { storeToRefs } from 'pinia';

const path = defineModel<paper.Path>('path');

const canvasId = ref('game-canvas');
const scope = ref<paper.PaperScope>();
const tool = ref<paper.Tool>();

const { color, strokeWidth } = storeToRefs(useDrawingStore());

onMounted(() => {
  scope.value = new paper.PaperScope();
  scope.value.setup(canvasId.value);
});

const handleMouseDown = () => {
  if (!scope.value) {
    return;
  }
  tool.value = new scope.value.Tool();
  tool.value.activate();

  tool.value.onMouseDown = (event: paper.MouseEvent) => {
    const newPath = new paper.Path({
      strokeJoin: 'round',
      strokeColor: color.value,
      strokeWidth: strokeWidth.value
    });
    path.value = newPath;
    newPath.add(event.point);
  };
  tool.value.onMouseDrag = (event: paper.MouseEvent) => {
    path.value?.add(event.point);
  };
  tool.value.onMouseUp = (event: paper.MouseEvent) => {
    path.value?.add(event.point);
  };
};
</script>

<template>
  <canvas
    :id="canvasId"
    class="absolute inset-0 bg-white w-full h-full rounded-lg"
    @mousedown="handleMouseDown"
  />
</template>
