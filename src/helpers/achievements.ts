import type { AchievementType } from '@/api/user/user.api.interface';

export const getAchievementLevelAmount = (level: number, achievementType: AchievementType) => {
  switch (level) {
    case 1:
      return achievementType.level1Amount;
    case 2:
      return achievementType.level2Amount;
    case 3:
    default:
      return achievementType.level3Amount;
  }
};

export const moneyForAchievementAmountByLevel = [100, 250, 500];
