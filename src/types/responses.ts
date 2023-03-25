import type Achievement from '@/models/achievement';

export type AchievementsResponse = {
  items: Achievement[];
  totalItems: number;
  updated: string;
};
