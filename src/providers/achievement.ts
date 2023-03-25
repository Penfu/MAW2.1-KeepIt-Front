import Achievement from '@/models/achievement';
import axios from 'axios';

export default class AchievementProvider {
  static async fetchAchievements(
    max: number = 10,
    offset: number = 0,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: number = 0
  ): Promise<Achievement[]> {
    try {
      const achievements = (
        await axios.get('users/' + userId + '/achievements')
      ).data;
      return achievements.data.items.map((book: JSON) =>
        Achievement.fromJson(book)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
