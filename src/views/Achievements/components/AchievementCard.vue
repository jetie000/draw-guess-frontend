<script setup lang="ts">
import type { Achievement } from '@/api/user/user.api.interface';
import Panel from '@/components/Panel/Panel.vue';
import { getAchievementLevelAmount } from '@/helpers/achievements';
import { computed } from 'vue';

const props = defineProps<{
  achievement: Achievement;
  progress: number;
  levelImg: string;
}>();

const progressWidthPercent = computed(
  () =>
    (props.progress /
      getAchievementLevelAmount(props.achievement.level + 1, props.achievement.type)) *
    100
);
</script>

<template>
  <Panel
    :key="achievement.id"
    class="flex flex-col"
  >
    <img
      class="h-40 mx-auto mb-3"
      :class="{ grayscale: achievement.level === 0 }"
      :src="levelImg"
      :alt="`level ${achievement.level}`"
    />
    <div class="text-center text-lg font-bold my-auto">{{ achievement.type.name }}</div>
    <div class="flex justify-around gap-2 mt-3">
      <div
        v-for="(amount, index) in [
          achievement.type.level1Amount,
          achievement.type.level2Amount,
          achievement.type.level3Amount
        ]"
        :key="amount"
        class="text-center relative"
      >
        <div
          v-if="index === achievement.level - 1"
          class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-blue-dark border-t-[10px] border-e-[10px] border-s-[10px] border-s-transparent border-e-transparent"
        />
        <div :class="{ 'font-bold text-red-primary': index === achievement.level - 1 }">
          {{ index + 1 }} lvl
        </div>
        <div class="mt-2 font-bold">{{ amount }}</div>
      </div>
    </div>
    <template v-if="achievement.level !== 3">
      <hr class="my-3 -mx-4" />
      <div class="mt-1 text-xs ms-auto mb-1 font-bold">
        {{ getAchievementLevelAmount(achievement.level + 1, achievement.type) - progress }}
        remaining to level {{ achievement.level + 1 }}
      </div>
      <div class="h-4 border border-blue-dark rounded-full bg-gray-100">
        <div
          :style="{
            width: `${progressWidthPercent}%`,
            height: '100%'
          }"
          class="rounded-s-[20px] bg-blue-light"
          :class="{ 'rounded-e-[20px]': progressWidthPercent > 95 }"
        />
      </div>
      <div class="text-sm me-auto mt-0.5 font-bold">
        {{ progress }} / {{ getAchievementLevelAmount(achievement.level + 1, achievement.type) }}
      </div>
    </template>
    <div
      v-else
      class="text-center text-gray-secondary mt-4"
    >
      {{ achievement.type.description }}
    </div>
  </Panel>
</template>
