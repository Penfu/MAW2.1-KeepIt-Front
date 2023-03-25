import User from './user';

export default class Invitation {
  readonly id: number;
  readonly createdAt?: Date | null;

  private _author?: User;

  private constructor(id: number, createdAt?: Date | null, author?: User) {
    this.id = id;
    this.createdAt = createdAt;

    this._author = author;
  }

  get author(): User | undefined {
    return this._author;
  }

  static fromJson(json: any): Invitation {
    const invitation = new Invitation(json.id, json.created_at);

    if (json.author) invitation._author = User.fromJson(json.author);

    return invitation;
  }
}
