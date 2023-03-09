export default class User {
  public email: string;
  public username: string | null;

  constructor(private _id: string, email: string, username: string | null) {
    this.email = email;
    this.username = username;
  }

  get id(): string {
    return this._id;
  }

  static fromJson(json: any): User {
    const user = new User(json.id, json.email, json.username);

    return user;
  }
}
