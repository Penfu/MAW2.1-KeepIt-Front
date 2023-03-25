import axios from 'axios';

import User from '@/models/user';
import Invitation from '@/models/invitation';

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

  static async fetchInvitations(id: number): Promise<Invitation[]> {
    try {
      const invitations = (await axios.get('/users/' + id + '/invitations'))
        .data;

      return invitations.data.items.map((invitation: JSON) =>
        Invitation.fromJson(invitation)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async sendInvitation(user: User): Promise<void> {
    try {
      const invitation = (await axios.post('/users/' + user.id + '/invite'))
        .data;
      user.receivedInvitation = Invitation.fromJson(invitation.data.item);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async cancelInvitation(user: User): Promise<void> {
    try {
      await axios.delete('/invitations/' + user.receivedInvitation?.id);
      user.receivedInvitation = undefined;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
