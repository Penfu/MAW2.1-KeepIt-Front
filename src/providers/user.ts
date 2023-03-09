import User from '@/models/user';
import axios from 'axios';

export default class UserProvider {
  static async fetchUser(id: string): Promise<User> {
    try {
      const user = (await axios.get('/users/' + id)).data;
      return User.fromJson(user);
    } catch (error) {
      throw error;
    }
  }
}
