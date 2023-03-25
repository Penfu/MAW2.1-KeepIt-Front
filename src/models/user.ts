import {
  validateOrReject,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  IsEmail,
} from 'class-validator';

export default class User {
  @IsDefined()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public username?: string | null;

  private _avatar: string;

  public receivedInvitation = false;
  public sentInvitation = false;
  public isFriend = false;

  private constructor(id: number, email: string, username?: string | null) {
    this.id = id;
    this.email = email;
    this.username = username;
    this._avatar = 'https://xsgames.co/randomusers/avatar.php?g=male';
  }

  static async make(
    id: number,
    email: string,
    username?: string | null
  ): Promise<User> {
    const user = new User(id, email, username);
    return user;
  }

  get avatar(): string {
    return this._avatar;
  }

  private static async validate(user: User): Promise<void> {
    await validateOrReject(user).catch((errors) => {
      throw new InvalidUserException(
        Object.values(errors[0].constraints as string).join(', ')
      );
    });
  }

  static async fromJson(json: any): Promise<User> {
    const user = await User.make(json.id, json.email, json.username);
    user.receivedInvitation = json.received_invitation;
    user.sentInvitation = json.sent_invitation;

    return user;
  }
}

export class InvalidUserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserException';
  }
}
