import axios from 'axios';

import User from '@/models/user';

export default class FriendProvider {
  static async fetchFriends(id: number): Promise<User[]> {
    try {
      const friends = (await axios.get('/users/' + id + '/friends')).data;
      return friends.data.items.map((friend: JSON) => User.fromJson(friend));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async sendInvitation(user: User): Promise<void> {
    try {
      await axios.post('/users/' + user.id + '/invite');
      user.receivedInvitation = true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
