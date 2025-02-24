<script setup lang="ts">
import paper from 'paper';
import { onMounted, ref, watch } from 'vue';
import { useDrawingStore } from '../stores/drawingStore';
import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { handleNetworkError } from '@/helpers/errors';
import { DrawingApi } from '@/api/drawing/drawing.api';
import type { AddDrawingRequest } from '@/api/drawing/drawing.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import type { Game } from '@/api/game/game.api.interface';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { defaultStrokeCapStyle, defaultStrokeJoinStyle } from '@/helpers/constants';

const path = defineModel<paper.Path>('path');
const props = defineProps<{ game: Game; user: Profile }>();

const canvasId = 'game-canvas';
const scope = ref<paper.PaperScope>();
const tool = ref<paper.Tool>();

const { color, strokeWidth } = storeToRefs(useDrawingStore());

const { data, isFetching, isError, error } = useQuery({
  queryKey: ['drawing', props.game.id],
  queryFn: () => DrawingApi.getCurrentGameDrawing(props.game.id)
});

const { mutate } = useMutation({
  mutationFn: (addDrawingRequest: AddDrawingRequest) => DrawingApi.createDrawing(addDrawingRequest),
  onError: (error) => {
    handleNetworkError(error);
  }
});

onMounted(() => {
  scope.value = new paper.PaperScope();
  scope.value.setup(canvasId);
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
  if (data.value && scope.value) {
    data.value.drawingParts.forEach((part) => {
      const newPath = new scope.value!.Path({
        strokeJoin: defaultStrokeJoinStyle,
        strokeCap: defaultStrokeCapStyle,
        strokeColor: part.color,
        strokeWidth: part.lineWidth
      });
      newPath.add(...part.posX.map((x, i) => ({ x, y: part.posY[i] }) as paper.PointLike));
      console.log(newPath.segments);
    });
  }
});

const handleMouseDown = () => {
  if (!scope.value) {
    return;
  }
  tool.value = new scope.value.Tool();
  tool.value.activate();

  tool.value.onMouseDown = (event: paper.MouseEvent) => {
    const newPath = new paper.Path({
      strokeJoin: defaultStrokeJoinStyle,
      strokeCap: defaultStrokeCapStyle,
      strokeColor: color.value,
      strokeWidth: strokeWidth.value
    });
    path.value = newPath;
    newPath.add(event.point);
  };
  tool.value.onMouseDrag = (event: paper.MouseEvent) => {
    if (!path.value) {
      return;
    }
    path.value.add(event.point);
  };
  tool.value.onMouseUp = (event: paper.MouseEvent) => {
    if (!path.value) {
      return;
    }
    path.value.add(event.point);
    path.value.simplify(0.8);
    mutate({
      color: color.value,
      gameId: props.game.id,
      lineWidth: strokeWidth.value,
      gamePlayerId: props.game.players.find((p) => p.user.id === props.user.id)!.id,
      roundNumber: props.game.currentRound,
      posX: path.value.segments.map((s) => s.point.x),
      posY: path.value.segments.map((s) => s.point.y),
      drawingId: 1
    });

    path.value = undefined;
  };
};
</script>

<template>
  <canvas
    :id="canvasId"
    class="rounded-lg cursor-crosshair aspect-square"
    :style="{ backgroundColor: 'white' }"
    @mousedown="handleMouseDown"
    @touchstart="handleMouseDown"
  />
</template>
