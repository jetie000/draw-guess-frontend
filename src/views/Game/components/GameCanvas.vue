<script setup lang="ts">
import paper from 'paper';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useDrawingStore } from '../stores/drawingStore';
import { storeToRefs } from 'pinia';
import { useMutation, type UseQueryReturnType } from '@tanstack/vue-query';
import { handleNetworkError } from '@/helpers/errors';
import { DrawingApi } from '@/api/drawing/drawing.api';
import type { AddDrawingRequest, Drawing, DrawingPart } from '@/api/drawing/drawing.api.interface';
import type { Profile } from '@/api/user/user.api.interface';
import type { Game } from '@/api/game/game.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import debounce from 'lodash.debounce';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { defaultStrokeCapStyle, defaultStrokeJoinStyle } from '@/helpers/constants';
import { socket } from '@/helpers/socket';

const path = defineModel<paper.Path>('path');
const props = defineProps<{
  game: Game;
  user: Profile;
  drawingData: UseQueryReturnType<Drawing | undefined, Error>;
  currentPlayerIndex: number;
  isBreak: boolean;
}>();

const emit = defineEmits<{
  addPart: [part: DrawingPart];
}>();

const canvasId = 'game-canvas';
const canvasRef = ref<HTMLCanvasElement>();

const scope = ref<paper.PaperScope>();
const tool = ref<paper.Tool>();
const canvasScale = ref(1);

const { color, strokeWidth } = storeToRefs(useDrawingStore());

const { mutate } = useMutation({
  mutationFn: (addDrawingRequest: AddDrawingRequest) => DrawingApi.createDrawing(addDrawingRequest),
  onError: (error) => {
    handleNetworkError(error);
  }
});

const setCanvasSize = () => {
  if (!canvasRef.value) {
    return;
  }
  canvasScale.value = Number(canvasRef.value.width) / window.devicePixelRatio / 800;
  canvasRef.value.width = 800;
  canvasRef.value.height = 800;
};

const debouncedSetCanvasSize = debounce(setCanvasSize, 500);

onMounted(() => {
  scope.value = new paper.PaperScope();
  scope.value.setup(canvasId);
  setCanvasSize();

  socket.on('drewPart', (part: DrawingPart) => {
    drawPart(part);
    emit('addPart', part);
  });

  window.addEventListener('resize', debouncedSetCanvasSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedSetCanvasSize);
  socket.off('drewPart');
});

watch(props.drawingData.isFetching, () => {
  if (props.drawingData.isError.value) {
    useErrorModalStore().showModal(props.drawingData.error.value);
  }
  if (props.drawingData.data.value && scope.value) {
    new scope.value.Rectangle({
      point: [0, 0],
      size: [800, 800],
      fillColor: '#fff'
    });
    props.drawingData.data.value.drawingParts.forEach((part) => {
      drawPart(part);
    });
  }
});

const drawPart = (part: DrawingPart) => {
  const newPath = new scope.value!.Path({
    strokeJoin: defaultStrokeJoinStyle,
    strokeCap: defaultStrokeCapStyle,
    strokeColor: part.color,
    strokeWidth: part.lineWidth
  });
  newPath.add(...part.posX.map((x, i) => ({ x, y: part.posY[i] }) as paper.PointLike));
};

const isCanvasDisabled = computed(
  () =>
    props.drawingData.isFetching.value ||
    props.drawingData.isError.value ||
    props.game.players.find((p) => p.user.id === props.user.id)?.user.id !==
      props.game.players[props.currentPlayerIndex].user.id
);

const handleMouseDown = () => {
  if (!scope.value || isCanvasDisabled.value || props.isBreak) {
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
    newPath.add({ x: event.point.x / canvasScale.value, y: event.point.y / canvasScale.value });
  };
  tool.value.onMouseDrag = (event: paper.MouseEvent) => {
    if (!path.value) {
      return;
    }
    path.value.add({ x: event.point.x / canvasScale.value, y: event.point.y / canvasScale.value });
  };
  tool.value.onMouseUp = (event: paper.MouseEvent) => {
    if (!path.value) {
      return;
    }
    path.value.add({ x: event.point.x / canvasScale.value, y: event.point.y / canvasScale.value });
    path.value.simplify(1);

    if (props.drawingData.data.value) {
      const drawing = {
        color: color.value,
        gameId: props.game.id,
        lineWidth: strokeWidth.value,
        posX: path.value.segments.map((s) => s.point.x),
        posY: path.value.segments.map((s) => s.point.y),
        drawingId: props.drawingData.data.value.id
      };
      mutate(drawing);

      socket.emit('drewPart', { drawing, room: props.game.id });
    }

    path.value = undefined;
    tool.value?.remove();
  };
};
</script>

<template>
  <Panel
    no-padding
    class="flex aspect-square max-w-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] grow"
  >
    <canvas
      :id="canvasId"
      ref="canvasRef"
      resize="true"
      class="rounded-lg aspect-square w-full h-full"
      :class="{ 'cursor-crosshair': !isCanvasDisabled && !isBreak }"
      :style="{ backgroundColor: 'white' }"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
    />
  </Panel>
</template>
