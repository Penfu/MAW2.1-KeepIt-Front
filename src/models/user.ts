import {
  validateOrReject,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export default class User {
  @IsDefined()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public username?: string | null;

  private _avatar: string;

  constructor(id: string, email: string, username?: string | null) {
    this.id = id;
    this.email = email;
    this.username = username;
    this._avatar = 'https://xsgames.co/randomusers/avatar.php?g=male';
  }

  static async fromJson(json: any): Promise<User> {
    const user = new User(json.id, json.email, json.username);

    await validateOrReject(user).catch((errors) => {
      return Promise.reject(errors);
    });

    return user;
  }

  get avatar(): string {
    return this._avatar;
  }
}
