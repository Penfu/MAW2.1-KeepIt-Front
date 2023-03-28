import axios from 'axios';

import User from '@/models/user';

export default class UserProvider {
  static async fetchUsers(): Promise<User[]> {
    try {
      const users = (await axios.get('/users')).data;
      return users.data.items.map((user: any) => User.fromJson(user));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async fetchUser(id: number): Promise<User> {
    try {
      const user = (await axios.get('/users/' + id)).data;
      return User.fromJson(user.data.item);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateUser(user: User): Promise<User> {
    try {
      const updatedUser = (await axios.put('/users/' + user.id, user)).data;
      return User.fromJson(updatedUser.data.item);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
