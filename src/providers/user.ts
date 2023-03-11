import User from '@/models/user';
import axios from 'axios';
import Provider from './provider';

export default class UserProvider {
  static async fetchUser(id: string): Promise<User> {
    try {
      const user = (await axios.get('/users/' + id)).data;
      return User.fromJson(user);
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(user: User): Promise<User> {
    try {
      const updatedUser = (
        await axios.put('/users/' + user.id, user, Provider.config())
      ).data;
      return User.fromJson(updatedUser);
    } catch (error) {
      throw error;
    }
  }
}
