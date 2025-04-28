import { pointsForFirstLevel, pointsIncreasingEveryLevel } from '@/typings/enums/game';

export const getLevelAndProgressByExp = (experience: number) => {
  let level = 1;
  let remainingExp = experience;
  let pointsToSubstract = pointsForFirstLevel;
  while (remainingExp > pointsToSubstract) {
    remainingExp -= pointsToSubstract;
    level++;
    pointsToSubstract += pointsIncreasingEveryLevel;
  }

  const colorIndex = Math.floor((level - 1) / 2);
  console.log();

  return {
    level,
    progress: Math.floor((remainingExp / pointsToSubstract) * 100),
    pointsEarnedAtLevel: remainingExp,
    pointsForNextLevel: pointsToSubstract,
    ...colorsByLevel[colorIndex > 14 ? 14 : colorIndex]
  };
};

export const colorsByLevel = [
  { color: '#000000', background: '#FFFFFF' },
  { color: '#8B6000', background: '#FFEEAA' },
  { color: '#008000', background: '#FFFFAA' },
  { color: '#008B8B', background: '#AAFFEE' },
  { color: '#0000FF', background: '#AAEFFF' },
  { color: '#800080', background: '#EAAEFF' },
  { color: '#FF1493', background: '#FFAAFF' },
  { color: '#FF4500', background: '#FFD1AA' },
  { color: '#006400', background: '#E6FFAA' },
  { color: '#228B22', background: '#AAFF7A' },
  { color: '#1E90FF', background: '#AADDFF' },
  { color: '#DA70D6', background: '#FFBBFF' },
  { color: '#FF4500', background: '#FFD700' },
  { color: '#9e6320', background: '#ffad33' },
  { color: '#FFD700', background: '#FF4500' }
];
