<script setup lang="ts">
import paper from 'paper';
import type { GameDrawing } from '@/api/game/game.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import debounce from 'lodash.debounce';
import { defaultStrokeCapStyle, defaultStrokeJoinStyle } from '@/helpers/constants';
import type { DrawingPart } from '@/api/drawing/drawing.api.interface';
import { drawingCanvasSize } from '@/typings/enums/game';

const props = defineProps<{ drawing: GameDrawing }>();

const canvasId = `game-canvas-${props.drawing.id}`;
const canvasRef = ref<HTMLCanvasElement>();
const scope = ref<paper.PaperScope>();
const canvasScale = ref(1);

const setCanvasSize = () => {
  if (!canvasRef.value) {
    return;
  }
  canvasScale.value = Number(canvasRef.value.width) / window.devicePixelRatio / drawingCanvasSize;
  canvasRef.value.width = drawingCanvasSize;
  canvasRef.value.height = drawingCanvasSize;
  props.drawing.drawingParts.forEach(drawPart);
};

const debouncedSetCanvasSize = debounce(setCanvasSize, 500);

onMounted(() => {
  scope.value = new paper.PaperScope();
  scope.value.setup(canvasId);
  setCanvasSize();

  window.addEventListener('resize', debouncedSetCanvasSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedSetCanvasSize);
});

const drawPart = (part: DrawingPart) => {
  const newPath = new paper.Path({
    strokeJoin: defaultStrokeJoinStyle,
    strokeCap: defaultStrokeCapStyle,
    strokeColor: part.color,
    strokeWidth: part.lineWidth
  });
  newPath.add(...part.posX.map((x, i) => ({ x, y: part.posY[i] }) as paper.PointLike));
  scope.value!.project.activeLayer.addChild(newPath);
};
</script>

<template>
  <Panel class="flex flex-col gap-2">
    <canvas
      :id="canvasId"
      ref="canvasRef"
      resize="true"
      class="rounded-lg aspect-square -m-4 rounded-b-none"
      :style="{ backgroundColor: 'white' }"
    />
    <div class="flex justify-between mt-4">
      <span>#{{ drawing.roundNumber }}</span>
      <span class="font-bold text-center">{{ drawing.word?.word }}</span>
    </div>
    <span class="text-right">by {{ drawing.gamePlayer.user.username }}</span>
  </Panel>
</template>
