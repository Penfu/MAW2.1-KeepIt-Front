import Achievement from '@/models/achievement';
import axios from 'axios';
import achievements from './achievements.json';

export default class AchievementProvider {
  static async fetchAchievements(
    max: number = 10,
    offset: number = 0,
    userId: string = ''
  ): Promise<Achievement[]> {
    // We are using a local JSON file until the backend is ready to serve achievements
    const internalJSON = achievements;
    try {
      // take max into account
      const achievements = internalJSON.slice(offset, offset + max);
      return achievements.map((achievement: any) =>
        Achievement.fromJson(achievement)
      );
    } catch (error) {
      throw error;
    }
  }
}
