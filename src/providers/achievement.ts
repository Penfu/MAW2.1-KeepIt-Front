import Achievement from '@/models/achievement';
import achievements from '@/providers/achievements.json';

export default class AchievementProvider {
  static async fetchAchievements(
    max: number = 10,
    offset: number = 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: number = 0
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
      console.log(error);
      throw error;
    }
  }
}
