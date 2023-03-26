import Achievement from '@/models/achievement';
import type { AchievementsResponse } from '@/types/responses';
import axios from 'axios';

export default class AchievementProvider {
  static async fetchCount(userId: Number): Promise<number> {
    try {
      const achievements = (
        await axios.get(`users/${userId}/achievements/count`)
      ).data;
      return achievements.data.item.count;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async fetchAchievements(
    userId: number,
    max: number = 4,
    offset: number = 1
  ): Promise<AchievementsResponse> {
    try {
      const achievements = (
        await axios.get(
          `users/${userId}/achievements?max=${max}&offset=${offset}`
        )
      ).data;
      return {
        items: achievements.data.items.map((book: JSON) =>
          Achievement.fromJson(book)
        ),
        totalItems: achievements.data.totalItems,
        updated: achievements.data.updated,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
