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
      await this.deleteFriendship(user.receivedInvitation!);
      user.receivedInvitation = undefined;
      user.friendship = undefined;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async acceptInvitation(invitation: Invitation): Promise<void> {
    try {
      await axios.put('/invitations/' + invitation.id + '/accept');
      invitation.author!.receivedInvitation = undefined;
      invitation.author!.friendship = invitation;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async declineInvitation(invitation: Invitation): Promise<void> {
    try {
      await this.deleteFriendship(invitation);
      invitation.author!.receivedInvitation = undefined;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async removeFriend(user: User): Promise<void> {
    try {
      await this.deleteFriendship(user.friendship!);
      user.friendship = undefined;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private static async deleteFriendship(invitation: Invitation): Promise<void> {
    await axios.delete('/invitations/' + invitation.id);
  }
}
